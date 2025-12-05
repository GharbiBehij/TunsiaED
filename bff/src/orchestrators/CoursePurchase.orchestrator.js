// Course Purchase Orchestrator
// Orchestrates transaction + payment + enrollment flow
import { paymentService } from '../Modules/payment/service/Payment.service.js';
import { transactionService } from '../Modules/Transaction/service/Transaction.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { userService } from '../Modules/User/service/User.service.js';
import { eventBus } from '../events/eventBus.js';

export class CoursePurchaseOrchestrator {
  /**
   * Initiate purchase (course or subscription)
   * @param {Object} user - Authenticated user
   * @param {Object} purchaseData - { courseId?, planId?, paymentType, paymentMethod }
   * @returns {Object} Payment DTO
   */
  async initiatePurchase(user, purchaseData) {
    let itemTitle, itemPrice, itemCurrency, itemId;

    // Handle subscription purchase
    if (purchaseData.planId) {
      const { adminService } = await import('../Modules/Admin/service/Admin.service.js');
      const plan = await adminService.getSubscriptionPlanByIdPublic(purchaseData.planId);
      if (!plan) {
        throw new Error('Subscription plan not found');
      }
      itemTitle = `${plan.name} Subscription`;
      itemPrice = plan.price || 0;
      itemCurrency = 'TND';
      itemId = purchaseData.planId;
    }
    // Handle course purchase
    else if (purchaseData.courseId) {
      const course = await courseService.getCourseByIdInternal(purchaseData.courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if already enrolled
      const enrollments = await enrollmentService.getUserEnrollments(user.uid);
      const alreadyEnrolled = enrollments.some(e => e.courseId === purchaseData.courseId);
      if (alreadyEnrolled) {
        throw new Error('Already enrolled in this course');
      }

      itemTitle = course.title;
      itemPrice = course.price || 0;
      itemCurrency = course.currency || 'TND';
      itemId = purchaseData.courseId;
    } else {
      throw new Error('Either courseId or planId is required');
    }

    // Create payment using payment service (internal)
    const payment = await paymentService.createPaymentInternal({
      userId: user.uid,
      courseId: purchaseData.courseId || null,
      planId: purchaseData.planId || null,
      courseTitle: itemTitle,
      amount: itemPrice,
      currency: itemCurrency,
      paymentType: purchaseData.paymentType || (purchaseData.planId ? 'subscription' : 'course_purchase'),
      subscriptionType: purchaseData.subscriptionType || null,
      paymentMethod: purchaseData.paymentMethod || null,
      status: 'pending',
    });

    // 4. Return clean DTO
    return {
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: payment.currency,
      courseId: payment.courseId,
      planId: payment.planId,
      courseTitle: payment.courseTitle,
      status: payment.status,
    };
  }

  /**
   * Complete purchase (creates transaction + enrollment)
   * Called after payment confirmation (webhook or frontend)
   * @param {Object} user - Authenticated user
   * @param {Object} confirmationData - { paymentId, gatewayTransactionId, paymentGateway }
   * @returns {Object} Purchase completion DTO
   */
  async completePurchase(user, confirmationData) {
    // 1. Get payment details (Payment service)
    const payment = await paymentService.getPaymentById(confirmationData.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.userId !== user.uid) {
      throw new Error('Unauthorized: Payment does not belong to this user');
    }

    if (payment.status === 'completed') {
      throw new Error('Payment already completed');
    }

    // 2. Create transaction using transaction service (internal)
    const transaction = await transactionService.createTransactionInternal({
      paymentId: payment.paymentId,
      userId: user.uid,
      courseId: payment.courseId,
      transactionType: 'course_purchase',
      amount: payment.amount,
      currency: payment.currency,
      status: 'completed',
      gatewayTransactionId: confirmationData.gatewayTransactionId || null,
      paymentGateway: confirmationData.paymentGateway || null,
      description: `Purchase of ${payment.courseTitle}`,
    });

    // 3. Update payment status (Payment service - internal)
    await paymentService.updatePaymentInternal(payment.paymentId, {
      status: 'completed',
      transactionId: transaction.transactionId,
    });

    // 4. Create enrollment only for course purchases (skip for subscriptions)
    let enrollment = null;
    if (payment.courseId && payment.paymentType !== 'subscription') {
      enrollment = await enrollmentService.createEnrollmentInternal(user.uid, {
        courseId: payment.courseId,
        courseTitle: payment.courseTitle,
        paymentId: payment.paymentId,
      });
    }
    // For subscriptions, enrollment is handled separately by subscription service

    // 5. Emit events for notifications (non-blocking)
    eventBus.emit('payment.completed', {
      userId: user.uid,
      courseTitle: payment.courseTitle,
      amount: payment.amount,
      transactionId: transaction.transactionId,
      paymentType: payment.paymentType,
    });

    // Emit enrollment event only for course purchases
    if (enrollment) {
      eventBus.emit('enrollment.created', {
        studentId: user.uid,
        instructorId: payment.instructorId || null,
        courseTitle: payment.courseTitle,
        courseThumbnail: payment.courseThumbnail || null,
      });
    }

    // Emit subscription event for subscription purchases
    if (payment.paymentType === 'subscription' && payment.planId) {
      eventBus.emit('subscription.activated', {
        userId: user.uid,
        planId: payment.planId,
        transactionId: transaction.transactionId,
      });

      // 5. Update user's subscription status in Firestore
      await userService.updateSubscriptionStatusInternal(user.uid, {
        hasActiveSubscription: true,
        activePlanId: payment.planId,
        subscriptionExpiresAt: null,
      });
    }

    // 6. Return clean DTO
    return {
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        status: transaction.status,
      },
      enrollment: enrollment ? {
        enrollmentId: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        courseTitle: enrollment.courseTitle,
        enrolledAt: enrollment.enrolledAt,
      } : null,
      hasActiveSubscription: payment.paymentType === 'subscription' && payment.planId ? true : undefined,
    };
  }

  /**
   * Get purchase status
   * @param {Object} user - Authenticated user
   * @param {string} paymentId - Payment ID
   * @returns {Object} Purchase status DTO
   */
  async getPurchaseStatus(user, paymentId) {
    // 1. Get payment (Payment service)
    const payment = await paymentService.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.userId !== user.uid) {
      throw new Error('Unauthorized');
    }

    // 2. Get transaction if exists (Transaction service)
    let transaction = null;
    if (payment.transactionId) {
      transaction = await transactionService.getTransactionById(payment.transactionId);
    }

    // 3. Get enrollment if exists (Enrollment service)
    let enrollment = null;
    if (payment.status === 'completed') {
      const enrollments = await enrollmentService.getUserEnrollments(user.uid);
      enrollment = enrollments.find(e => e.courseId === payment.courseId);
    }

    // 4. Return clean DTO
    return {
      payment: {
        paymentId: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        courseTitle: payment.courseTitle,
      },
      transaction: transaction ? {
        transactionId: transaction.transactionId,
        status: transaction.status,
        gatewayTransactionId: transaction.gatewayTransactionId,
      } : null,
      enrollment: enrollment ? {
        enrollmentId: enrollment.enrollmentId,
        enrolledAt: enrollment.enrolledAt,
      } : null,
    };
  }
}

export const coursePurchaseOrchestrator = new CoursePurchaseOrchestrator();
