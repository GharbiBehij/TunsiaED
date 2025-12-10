// Course Purchase Orchestrator
// Orchestrates transaction + payment + enrollment flow
import { paymentService } from '../Modules/payment/service/Payment.service.js';
import { transactionService } from '../Modules/Transaction/service/Transaction.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { userService } from '../Modules/User/service/User.service.js';
import { eventBus } from '../events/eventBus.js';
import { cacheClient, REDIS_KEY_REGISTRY } from '../core/cache/cacheClient.js';

export class CoursePurchaseOrchestrator {
  /**
   * Initiate purchase (course or subscription)
   * @param {Object} user - Authenticated user
   * @param {Object} purchaseData - { courseId?, planId?, paymentType, paymentMethod }
   * @returns {Promise<Object>} Payment DTO
   */
  async initiatePurchase(user, purchaseData) {
    console.log('🔄 [Orchestrator] initiatePurchase called:', {
      userId: user.uid,
      courseId: purchaseData.courseId,
      planId: purchaseData.planId,
      paymentType: purchaseData.paymentType
    });
    
    let itemTitle, itemPrice, itemCurrency, itemId;

    // Handle subscription purchase
    if (purchaseData.planId) {
      console.log('📋 [Orchestrator] Processing subscription purchase...');
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
      console.log('📚 [Orchestrator] Processing course purchase:', purchaseData.courseId);
      const course = await courseService.getCourseByIdInternal(purchaseData.courseId);
      if (!course) {
        console.error('❌ [Orchestrator] Course not found:', purchaseData.courseId);
        throw new Error('Course not found');
      }
      console.log('✅ [Orchestrator] Course found:', course.title);

      // Check if already enrolled
      console.log('🔍 [Orchestrator] Checking enrollment status...');
      const enrollments = await enrollmentService.getUserEnrollments(user.uid);
      const alreadyEnrolled = enrollments.some(e => e.courseId === purchaseData.courseId);
      if (alreadyEnrolled) {
        console.error('⛔ [Orchestrator] User already enrolled in course');
        throw new Error('Already enrolled in this course');
      }
      console.log('✅ [Orchestrator] Enrollment check passed');

      itemTitle = course.title;
      itemPrice = course.price || 0;
      itemCurrency = course.currency || 'TND';
      itemId = purchaseData.courseId;
    } else {
      throw new Error('Either courseId or planId is required');
    }

    // Create payment using payment service (internal)
    console.log('💾 [Orchestrator] Creating payment record:', {
      amount: itemPrice,
      currency: itemCurrency,
      courseTitle: itemTitle
    });
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
    console.log('✅ [Orchestrator] Payment record created:', payment.paymentId);

    // 4. Return clean DTO
    console.log('✅ [Orchestrator] initiatePurchase completed successfully');
    const responseDto = {
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: payment.currency,
      courseId: payment.courseId,
      planId: payment.planId,
      courseTitle: payment.courseTitle,
      status: payment.status,
    };
    console.log('✅ [Orchestrator] Returning DTO with paymentId:', responseDto.paymentId);
    return responseDto;
  }

  /**
   * Initiate Stripe Checkout
   * Orchestrates Stripe checkout session creation
   * @param {Object} user - Authenticated user
   * @param {string} paymentId - Internal payment ID
   * @param {Object} customerData - { firstName, lastName, email, phone, note }
   * @returns {Promise<Object>} Stripe checkout data
   */
  async initiateStripeCheckout(user, paymentId, customerData) {
    console.log('🔄 [Orchestrator] initiateStripeCheckout called:', {
      userId: user.uid,
      paymentId,
      email: customerData.email
    });

    // 1. Get payment details
    const payment = await paymentService.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.userId !== user.uid) {
      throw new Error('Unauthorized: Payment does not belong to this user');
    }

    // 2. Initiate Stripe checkout via Payment Service
    console.log('💳 [Orchestrator] Initiating Stripe checkout session...');
    const stripeResult = await paymentService.initiateStripePayment(user.uid, {
      courseId: payment.courseId,
      amount: payment.amount,
      paymentType: payment.paymentType,
      currency: payment.currency || 'usd',
    }, {
      note: customerData.note || `Course Purchase: ${payment.courseTitle}`,
      firstName: customerData.firstName || user.firstName || 'Customer',
      lastName: customerData.lastName || user.lastName || 'User',
      email: customerData.email || user.email,
      phone: customerData.phone || user.phone || '+21600000000',
    });

    console.log('✅ [Orchestrator] Stripe checkout session created:', stripeResult.sessionId);

    // 3. Invalidate relevant caches
    await cacheClient.invalidate(REDIS_KEY_REGISTRY.STUDENT_DASHBOARD(user.uid));

    return stripeResult;
  }

  /**
   * Complete purchase (creates transaction + enrollment)
   * Called after payment confirmation (webhook or frontend)
   * @param {Object} user - Authenticated user
   * @param {Object} confirmationData - { paymentId, gatewayTransactionId, paymentGateway }
   * @returns {Promise<Object>} Purchase completion DTO
   */
  async completePurchase(user, confirmationData) {
    console.log('🔄 [Orchestrator] completePurchase called:', {
      userId: user.uid,
      paymentId: confirmationData.paymentId,
      gatewayTransactionId: confirmationData.gatewayTransactionId
    });
    
    // 1. Get payment details (Payment service)
    console.log('🔍 [Orchestrator] Fetching payment details...');
    const payment = await paymentService.getPaymentById(confirmationData.paymentId);
    if (!payment) {
      console.error('❌ [Orchestrator] Payment not found:', confirmationData.paymentId);
      throw new Error('Payment not found');
    }
    console.log('✅ [Orchestrator] Payment found:', {
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount
    });

    if (payment.userId !== user.uid) {
      throw new Error('Unauthorized: Payment does not belong to this user');
    }

    // Idempotency: If already completed, check if enrollment exists
    if (payment.status === 'completed') {
      console.log('⚠️  [Orchestrator] Idempotency check: Payment already completed:', {
        paymentId: payment.paymentId,
        status: payment.status
      });
      
      // Get existing transaction and enrollment
      let transaction = null;
      if (payment.transactionId) {
        transaction = await transactionService.getTransactionById(payment.transactionId);
      }
      
      let enrollment = null;
      if (payment.courseId && payment.paymentType !== 'subscription') {
        const enrollments = await enrollmentService.getUserEnrollments(user.uid);
        enrollment = enrollments.find(e => e.courseId === payment.courseId);
      }
      
      // Return existing data (idempotent response)
      return {
        success: true,
        transaction: transaction ? {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          status: transaction.status,
        } : null,
        enrollment: enrollment ? {
          enrollmentId: enrollment.enrollmentId,
          courseId: enrollment.courseId,
          courseTitle: enrollment.courseTitle,
        } : null,
        message: 'Payment already completed (idempotent)',
      };
    }

    // 2. Create transaction using transaction service (internal)
    console.log('💳 [Orchestrator] Creating transaction record...');
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
    console.log('✅ [Orchestrator] Transaction created:', transaction.transactionId);

    // 3. Update payment status (Payment service - internal)
    console.log('💾 [Orchestrator] Updating payment status to completed...');
    await paymentService.updatePaymentInternal(payment.paymentId, {
      status: 'completed',
      transactionId: transaction.transactionId,
    });
    console.log('✅ [Orchestrator] Payment status updated to completed');

    // 4. Create enrollment only for course purchases (skip for subscriptions)
    let enrollment = null;
    if (payment.courseId && payment.paymentType !== 'subscription') {
      console.log('📝 [Orchestrator] Creating enrollment for course:', payment.courseId);
      enrollment = await enrollmentService.createEnrollmentInternal(user.uid, {
        courseId: payment.courseId,
        courseTitle: payment.courseTitle,
        paymentId: payment.paymentId,
      });
      console.log('✅ [Orchestrator] Enrollment created:', enrollment.enrollmentId);
    } else {
      console.log('⏭️  [Orchestrator] Skipping enrollment (subscription or no courseId)');
    }
    // For subscriptions, enrollment is handled separately by subscription service

    // 5. Emit events for Firebase push notifications (non-blocking, mobile/web alerts)
    console.log('📡 [Orchestrator] Emitting events for push notifications...');
    // Note: Emails are sent directly in payment controllers via SMTP adapter
    eventBus.emit('payment.completed', {
      userId: user.uid,
      courseTitle: payment.courseTitle,
      amount: payment.amount,
      transactionId: transaction.transactionId,
      paymentType: payment.paymentType,
    });

    // Emit enrollment event only for course purchases
    if (enrollment) {
      console.log('📡 [Orchestrator] Emitting enrollment.created event');
      eventBus.emit('enrollment.created', {
        studentId: user.uid,
        instructorId: payment.instructorId || null,
        courseTitle: payment.courseTitle,
        courseThumbnail: payment.courseThumbnail || null,
      });
    }

    // Emit subscription event for subscription purchases
    if (payment.paymentType === 'subscription' && payment.planId) {
      console.log('📡 [Orchestrator] Emitting subscription.activated event');
      eventBus.emit('subscription.activated', {
        userId: user.uid,
        planId: payment.planId,
        transactionId: transaction.transactionId,
      });

      // 5. Update user's subscription status in Firestore
      console.log('💾 [Orchestrator] Updating user subscription status...');
      await userService.updateSubscriptionStatusInternal(user.uid, {
        hasActiveSubscription: true,
        activePlanId: payment.planId,
        subscriptionExpiresAt: null,
      });
    }

    // 6. Invalidate affected cache keys
    console.log('🗑️ [Orchestrator] Invalidating cache keys for enrollment creation...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.INSTRUCTOR_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.ENROLLMENT);

    // 7. Return clean DTO
    console.log('✅ [Orchestrator] completePurchase finished successfully');
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
   * Process Stripe Webhook
   * Orchestrates webhook verification and purchase completion
   * Flow: Verify Webhook → Process Webhook → Complete Purchase
   * @param {string} payload - Raw webhook payload
   * @param {string} signature - Stripe signature header
   * @returns {Promise<Object>} Webhook processing result
   */
  async processStripeWebhook(payload, signature) {
    console.log('🔔 [Orchestrator] processStripeWebhook called');

    // 1. Verify webhook signature (Payment Service → Stripe Service)
    console.log('🔐 [Orchestrator] Verifying webhook signature...');
    const event = await paymentService.verifyStripeWebhook(payload, signature);
    console.log('✅ [Orchestrator] Webhook signature verified:', {
      eventType: event.type,
      eventId: event.id
    });

    // 2. Process webhook data (Payment Service → Stripe Service)
    console.log('📋 [Orchestrator] Processing webhook data...');
    const webhookResult = await paymentService.processStripeWebhook(event);
    console.log('✅ [Orchestrator] Webhook processed:', {
      success: webhookResult.success,
      orderId: webhookResult.orderId,
      transactionId: webhookResult.transactionId
    });

    // 3. Return webhook result for controller to handle completion
    return {
      verified: true,
      event,
      webhookResult,
    };
  }

  /**
   * Handle Webhook Completion
   * Orchestrates the complete webhook flow including purchase completion and notifications
   * Flow: Verify Payment → Complete Purchase → Send Emails → Return Result
   * @param {Object} webhookResult - Processed webhook result
   * @param {Object} payment - Payment record
   * @returns {Promise<Object>} Completion result
   */
  async handleWebhookCompletion(webhookResult, payment) {
    console.log('🔄 [Orchestrator] handleWebhookCompletion called:', {
      orderId: webhookResult.orderId,
      success: webhookResult.success
    });

    // 1. Get user and course info
    const user = await userService.findByUid(payment.userId);
    const course = await courseService.getCourseByIdInternal(payment.courseId);
    const courseTitle = course?.title || payment.courseTitle || 'Course Purchase';

    if (webhookResult.success) {
      console.log('💰 [Orchestrator] Payment successful - completing purchase...');

      // 2. Complete the purchase (transaction + enrollment)
      const confirmationData = {
        paymentId: payment.paymentId,
        gatewayTransactionId: String(webhookResult.transactionId),
        paymentGateway: 'Stripe',
      };

      const orchestratorResult = await this.completePurchase(user, confirmationData);
      console.log('✅ [Orchestrator] Purchase completed:', {
        transactionId: orchestratorResult.transaction?.transactionId,
        enrollmentId: orchestratorResult.enrollment?.enrollmentId
      });

      // 3. Send success email (imported dynamically to avoid circular deps)
      const emailService = (await import('../utils/EmailService.js')).default;
      console.log('📧 [Orchestrator] Sending success email to:', user.email);
      const emailResult = await emailService.sendPaymentSuccessEmail({
        email: user.email,
        firstName: user.firstName || webhookResult.customer?.firstName || 'Customer',
        lastName: user.lastName || webhookResult.customer?.lastName || '',
        courseTitle,
        amount: webhookResult.amount,
        transactionId: String(webhookResult.transactionId),
        paymentMethod: 'Stripe',
      });
      console.log(`${emailResult?.success !== false ? '✅' : '❌'} [Orchestrator] Email sent:`, 
        emailResult?.success !== false ? 'success' : emailResult?.error);

      return {
        success: true,
        message: 'Payment completed successfully',
        transaction: orchestratorResult.transaction,
        enrollment: orchestratorResult.enrollment,
      };
    } else {
      console.log('❌ [Orchestrator] Payment failed - updating status...');

      // 2. Update payment status to failed
      await paymentService.updatePaymentInternal(payment.paymentId, {
        status: 'failed',
        failureReason: 'Payment declined by Stripe',
      });
      console.log('✅ [Orchestrator] Payment status updated to failed');

      // 3. Send failure email
      const emailService = (await import('../utils/EmailService.js')).default;
      console.log('📧 [Orchestrator] Sending failure email to:', user.email);
      await emailService.sendPaymentFailedEmail({
        email: user.email,
        firstName: user.firstName || webhookResult.customer?.firstName || 'Customer',
        lastName: user.lastName || webhookResult.customer?.lastName || '',
        courseTitle,
        amount: payment.amount,
        reason: 'Payment was declined or cancelled',
      });

      return {
        success: false,
        message: 'Payment failed',
      };
    }
  }

  /**
   * Get purchase status
   * @param {Object} user - Authenticated user
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Purchase status DTO
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
