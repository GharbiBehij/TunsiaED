// Course Purchase Orchestrator
// Orchestrates transaction + payment + enrollment flow
import { paymentService } from '../Modules/payment/service/Payment.service.js';
import { transactionService } from '../Modules/Transaction/service/Transaction.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { eventBus } from '../events/eventBus.js';

export class CoursePurchaseOrchestrator {
  /**
   * Initiate course purchase (creates payment)
   * @param {Object} user - Authenticated user
   * @param {Object} purchaseData - { courseId, paymentType, subscriptionType, paymentMethod }
   * @returns {Object} Payment DTO
   */
  async initiatePurchase(user, purchaseData) {
    // 1. Validate course exists (Course service - internal)
    const course = await courseService.getCourseByIdInternal(purchaseData.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // 2. Check if already enrolled (Enrollment service)
    const enrollments = await enrollmentService.getUserEnrollments(user.uid);
    const alreadyEnrolled = enrollments.some(e => e.courseId === purchaseData.courseId);
    if (alreadyEnrolled) {
      throw new Error('Already enrolled in this course');
    }

    // 3. Create payment using payment service (internal)
    const payment = await paymentService.createPaymentInternal({
      userId: user.uid,
      courseId: purchaseData.courseId,
      courseTitle: course.title,
      amount: course.price || 0,
      currency: course.currency || 'TND',
      paymentType: purchaseData.paymentType || 'course_purchase',
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

    // 4. Create enrollment using enrollment service (internal)
    const enrollment = await enrollmentService.createEnrollmentInternal(user.uid, {
      courseId: payment.courseId,
      courseTitle: payment.courseTitle,
      paymentId: payment.paymentId,
    });

    // 5. Emit events for notifications (non-blocking)
    eventBus.emit('payment.completed', {
      userId: user.uid,
      courseTitle: payment.courseTitle,
      amount: payment.amount,
      transactionId: transaction.transactionId,
    });

    eventBus.emit('enrollment.created', {
      studentId: user.uid,
      instructorId: payment.instructorId || null,
      courseTitle: payment.courseTitle,
      courseThumbnail: payment.courseThumbnail || null,
    });

    // 6. Return clean DTO
    return {
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        status: transaction.status,
      },
      enrollment: {
        enrollmentId: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        courseTitle: enrollment.courseTitle,
        enrolledAt: enrollment.enrolledAt,
      },
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
