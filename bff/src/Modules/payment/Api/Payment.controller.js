// bff/src/Modules/payment/Api/Payment.controller.js
// Uses orchestrators for cross-module operations
import { paymentService } from '../service/Payment.service.js';
import { coursePurchaseOrchestrator } from '../../../orchestrators/CoursePurchase.orchestrator.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { stripeService } from '../service/StripeService.js';
import emailService from '../../../utils/EmailService.js'; // Emails via SMTP adapter
import { courseService } from '../../Course/service/Course.service.js';

export class PaymentController {
  /**
   * Create payment (direct service call)
   * Single module operation
   */
  async createPayment(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const data = req.body;
      const result = await paymentService.createPayment(userId, data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get payment by ID (direct service call)
   * Single module operation
   */
  async getPaymentById(req, res) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentById(paymentId);
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update payment (direct service call)
   * Single module operation
   */
  async updatePayment(req, res) {
    try {
      const { paymentId } = req.params;
      const data = req.body;
      const transactionId = data.status === 'completed' ? req.body.transactionId : undefined;
      
      const result = await paymentService.updatePayment(paymentId, data, transactionId);
      
      if (!result) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get user payments (direct service call)
   * Single module operation
   */
  async getUserPayments(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const payments = await paymentService.getUserPayments(userId);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get course payments (direct service call)
   * Single module operation
   */
  async getCoursePayments(req, res) {
    try {
      const { courseId } = req.params;
      const payments = await paymentService.getCoursePayments(courseId);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get payments by status (direct service call)
   * Single module operation
   */
  async getPaymentsByStatus(req, res) {
    try {
      const { status } = req.params;
      const payments = await paymentService.getPaymentsByStatus(status);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * ORCHESTRATED ENDPOINTS - Cross-module operations
   */

  /**
   * Initiate course purchase
   * ORCHESTRATOR: Creates payment and validates course enrollment
   * Cross-module: Payment + Course + Enrollment modules
   */
  async initiatePurchase(req, res) {
    const requestId = `INIT_${Date.now()}`;
    console.log(`🚀 [${requestId}] Purchase initiation request:`, {
      courseId: req.body.courseId,
      paymentType: req.body.paymentType
    });
    try {
      const userId = req.user?.uid;
      if (!userId) {
        console.log(`⛔ [${requestId}] Authentication required`);
        return res.status(401).json({ error: 'Authentication required' });
      }
      console.log(`👤 [${requestId}] User authenticated:`, userId);

      const user = await userRepository.findByUid(userId);
      const purchaseData = req.body; // { courseId, paymentType, subscriptionType, paymentMethod }

      // Use orchestrator for cross-module purchase initiation
      const paymentData = await coursePurchaseOrchestrator.initiatePurchase(user, purchaseData);
      console.log(`✅ [${requestId}] Payment initiated successfully:`, paymentData.id);
      res.status(201).json(paymentData);
    } catch (error) {
      console.log(`❌ [${requestId}] Payment initiation failed:`, error.message);
      if (error.message.includes('not found') || error.message.includes('already enrolled')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Complete course purchase
   * ORCHESTRATOR: Creates transaction and enrollment after payment confirmation
   * Cross-module: Payment + Transaction + Enrollment + Progress modules
   * Sends email notification to user on success
   */
  async completePurchase(req, res) {
    
    let transaction = null;

    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const confirmationData = req.body; // { paymentId, gatewayTransactionId, paymentGateway }

      // Use orchestrator for cross-module purchase completion
      const result = await coursePurchaseOrchestrator.completePurchase(user, confirmationData);

      // Get payment and course info for email
      const payment = await paymentService.getPaymentById(confirmationData.paymentId);
      const course = await courseService.getCourseById(payment?.courseId);

      // Send success email (non-blocking)
      if (payment && course) {
        emailService.sendPaymentSuccessEmail({
          email: user.email,
          firstName: user.firstName || 'Customer',
          lastName: user.lastName || '',
          courseTitle: course.title || 'Course Purchase',
          amount: payment.amount,
          transactionId: confirmationData.gatewayTransactionId || result.transaction?.id || 'N/A',
          paymentMethod: confirmationData.paymentGateway || 'Card',
        }).catch(err => console.error('Failed to send success email:', err));
      }

      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Unauthorized' || error.message.includes('not found')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('already completed')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get purchase status
   * ORCHESTRATOR: Returns complete purchase status (payment + transaction + enrollment)
   * Cross-module: Payment + Transaction + Enrollment modules
   */
  async getPurchaseStatus(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const { paymentId } = req.params;

      // Use orchestrator for cross-module status retrieval
      const statusData = await coursePurchaseOrchestrator.getPurchaseStatus(user, paymentId);
      res.status(200).json(statusData);
    } catch (error) {
      if (error.message === 'Unauthorized' || error.message.includes('not found')) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * STRIPE GATEWAY ENDPOINTS
   * International payment gateway integration (https://stripe.com)
   */

  /**
   * Initiate Stripe payment
   * Creates a payment record and returns Stripe Checkout URL
   * @param {Object} req.body - { courseId, amount, note, firstName, lastName, email, phone }
   */
  async initiateStripePayment(req, res) {
    const requestId = `REQ_${Date.now()}`;
    console.log(`🚀 [${requestId}] Stripe payment initiation started`);
    
    try {
      const userId = req.user?.uid;
      if (!userId) {
        console.log(`⛔ [${requestId}] Authentication required`);
        return res.status(401).json({ error: 'Authentication required' });
      }

      console.log(`👤 [${requestId}] User ID:`, userId);
      const user = await userRepository.findByUid(userId);
      console.log(`✅ [${requestId}] User found:`, user.email);
      const { courseId, amount, note, firstName, lastName, email, phone } = req.body;

      // Step 1: Create internal payment record first
      const internalPayment = await paymentService.createPayment(userId, {
        courseId,
        amount,
        paymentType: 'course_purchase',
        paymentMethod: 'stripe',
        status: 'pending',
      });

      // Step 2: Initiate Stripe payment
      let stripeResult;
      try {
        stripeResult = await stripeService.initiatePayment({
          amount,
          note: note || `Course Purchase: ${courseId}`,
          firstName: firstName || user.firstName || 'Customer',
          lastName: lastName || user.lastName || 'User',
          email: email || user.email,
          phone: phone || user.phone || '+21600000000',
          orderId: internalPayment.id, // Link to our internal payment ID
        });
      } catch (stripeError) {
        // Stripe is down or unavailable
        if (stripeError.message.includes('STRIPE_SERVER_DOWN') || stripeError.message.includes('STRIPE_SERVER_ERROR')) {
          // Update payment status to indicate gateway issue
          await paymentService.updatePayment(internalPayment.id, {
            status: 'failed',
            failureReason: 'Payment gateway temporarily unavailable',
          });
          
          return res.status(503).json({
            error: 'Payment gateway temporarily unavailable',
            message: 'Our payment system is currently under maintenance. Please try again in a few minutes or use the simulation option for testing.',
            paymentId: internalPayment.id,
            canSimulate: process.env.NODE_ENV !== 'production',
          });
        }
        
        // Other errors - rethrow
        throw stripeError;
      }

      // Step 3: Update internal payment with Stripe session ID
      await paymentService.updatePayment(internalPayment.id, {
        stripeSessionId: stripeResult.sessionId,
        checkoutUrl: stripeResult.checkoutUrl,
      });

      res.status(201).json({
        success: true,
        paymentId: internalPayment.id,
        sessionId: stripeResult.sessionId,
        checkoutUrl: stripeResult.checkoutUrl,
        amount: stripeResult.amount,
      });
    } catch (error) {
      console.error('Stripe initiation error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle Stripe webhook
   * Receives payment status from Stripe after payment attempt
   * No authentication - verified by signature
   * Sends email notification to user on success/failure
   */
  async handleStripeWebhook(req, res) {
    const webhookId = `WHK_${Date.now()}`;
    console.log(`🔔 [${webhookId}] Stripe webhook received:`, {
      eventType: req.body?.type,
      eventId: req.body?.id,
      timestamp: new Date().toISOString()
    });

    try {
      // Process and verify webhook data
      console.log(`📋 [${webhookId}] Processing webhook data...`);
      const webhookResult = stripeService.processWebhook(req.body);
      console.log(`✅ [${webhookId}] Webhook processed:`, {
        success: webhookResult.success,
        orderId: webhookResult.orderId,
        transactionId: webhookResult.transactionId
      });

      // Get internal payment by order_id (which is our paymentId)
      console.log(`🔍 [${webhookId}] Looking up payment:`, webhookResult.orderId);
      const payment = await paymentService.getPaymentById(webhookResult.orderId);
      
      if (!payment) {
        console.error(`❌ [${webhookId}] Payment not found:`, webhookResult.orderId);
        return res.status(404).json({ error: 'Payment not found' });
      }
      console.log(`✅ [${webhookId}] Payment found:`, {
        paymentId: payment.id,
        status: payment.status,
        userId: payment.userId,
        courseId: payment.courseId
      });

      // ═══════════════════════════════════════════════════════
      // IDEMPOTENCY CHECK: Prevent duplicate processing
      // ═══════════════════════════════════════════════════════
      if (payment.status === 'completed') {
        console.log(`⚠️  [${webhookId}] Idempotency check: Payment already completed:`, {
          paymentId: webhookResult.orderId,
          status: payment.status,
          message: 'Duplicate webhook ignored'
        });
        return res.status(200).json({ received: true, message: 'Already processed' });
      }

      // Get user and course info for email
      const user = await userRepository.findByUid(payment.userId);
      const course = await courseService.getCourseById(payment.courseId);
      const courseTitle = course?.title || 'Course Purchase';

      if (webhookResult.success) {
        console.log(`💰 [${webhookId}] Payment successful - initiating purchase completion...`);
        
        // Payment successful - complete the purchase using orchestrator
        const confirmationData = {
          paymentId: payment.id,
          gatewayTransactionId: String(webhookResult.transactionId),
          paymentGateway: 'Stripe',
        };
        console.log(`🔄 [${webhookId}] Calling orchestrator with:`, confirmationData);

        const orchestratorResult = await coursePurchaseOrchestrator.completePurchase(user, confirmationData);
        console.log(`✅ [${webhookId}] Orchestrator completed:`, {
          transactionId: orchestratorResult.transaction?.transactionId,
          enrollmentId: orchestratorResult.enrollment?.enrollmentId
        });

        // Send success email via SMTP adapter (push notification sent via event bus)
        console.log(`📧 [${webhookId}] Sending success email to:`, user.email);
        const emailResult = await emailService.sendPaymentSuccessEmail({
          email: user.email,
          firstName: user.firstName || webhookResult.customer?.firstName || 'Customer',
          lastName: user.lastName || webhookResult.customer?.lastName || '',
          courseTitle,
          amount: webhookResult.amount,
          transactionId: String(webhookResult.transactionId),
          paymentMethod: 'Stripe',
        });
        console.log(`${emailResult?.success !== false ? '✅' : '❌'} [${webhookId}] Email sent:`, emailResult?.success !== false ? 'success' : emailResult?.error);

        console.log(`🎉 [${webhookId}] Stripe payment completed successfully:`, webhookResult.orderId);
      } else {
        console.log(`❌ [${webhookId}] Payment failed - updating status...`);
        
        // Payment failed - update payment status
        await paymentService.updatePayment(payment.id, {
          status: 'failed',
          failureReason: 'Payment declined by Stripe',
        });
        console.log(`✅ [${webhookId}] Payment status updated to failed`);

        // Send failure email via SMTP adapter (push notification sent via event bus)
        console.log(`📧 [${webhookId}] Sending failure email to:`, user.email);
        await emailService.sendPaymentFailedEmail({
          email: user.email,
          firstName: user.firstName || webhookResult.customer?.firstName || 'Customer',
          lastName: user.lastName || webhookResult.customer?.lastName || '',
          courseTitle,
          amount: payment.amount,
          reason: 'Payment was declined or cancelled',
        });

        console.log(`❌ [${webhookId}] Stripe payment failed:`, webhookResult.orderId);
      }

      // Always respond 200 to Stripe
      console.log(`✅ [${webhookId}] Webhook processing complete - responding to Stripe`);
      res.status(200).json({ received: true });
    } catch (error) {
      console.error(`💥 [${webhookId}] Stripe webhook error:`, {
        error: error.message,
        stack: error.stack,
        orderId: req.body?.data?.object?.client_reference_id
      });
      // Still respond 200 to avoid Stripe retries
      res.status(200).json({ received: true, error: error.message });
    }
  }

  /**
   * Get Stripe payment status by session ID
   * Used to check payment status on frontend after Stripe Checkout completion
   */
  async getStripePaymentStatus(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { token } = req.params;

      // Find payment by Stripe session ID
      const payments = await paymentService.getUserPayments(userId);
      const payment = payments.find(p => p.stripeSessionId === token);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json({
        paymentId: payment.id,
        status: payment.status,
        courseId: payment.courseId,
        amount: payment.amount,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Simulate Payment (for testing when payment gateway is unavailable)
   * Creates payment, completes it, and sends email notification
   * @param {Object} req.body - { courseId, amount, simulateSuccess: true/false }
   */
  async simulatePayment(req, res) {
    if (process.env.NODE_ENV === 'production') {
  return res.status(403).json({ error: 'Simulation not available in production' });
}
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const { courseId, simulateSuccess = true } = req.body;

      // Get course info
      const course = await courseService.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const amount = course.price || 0;
      const transactionId = `SIM_${Date.now()}`;

      if (simulateSuccess) {
        // Simulate successful payment
        // Step 1: Create payment
        const payment = await paymentService.createPaymentInternal({
          userId,
          courseId,
          amount,
          paymentType: 'course_purchase',
          paymentMethod: 'simulation',
          status: 'pending',
        });

        // Step 2: Complete purchase via orchestrator
        const confirmationData = {
          paymentId: payment.id,
          gatewayTransactionId: transactionId,
          paymentGateway: 'simulation',
        };
        const result = await coursePurchaseOrchestrator.completePurchase(user, confirmationData);

        // Step 3: Send success email via SMTP adapter
        await emailService.sendPaymentSuccessEmail({
          email: user.email,
          firstName: user.firstName || 'Customer',
          lastName: user.lastName || '',
          courseTitle: course.title,
          amount,
          transactionId,
          paymentMethod: 'Test Payment',
        });

        res.status(200).json({
          success: true,
          message: 'Payment simulated successfully. Check your email for confirmation.',
          paymentId: payment.id,
          transactionId,
          enrollment: result.enrollment,
        });
      } else {
        // Simulate failed payment
        // Create payment with failed status
        const payment = await paymentService.createPaymentInternal({
          userId,
          courseId,
          amount,
          paymentType: 'course_purchase',
          paymentMethod: 'simulation',
          status: 'failed',
        });

        // Send failure email via SMTP adapter
        await emailService.sendPaymentFailedEmail({
          email: user.email,
          firstName: user.firstName || 'Customer',
          lastName: user.lastName || '',
          courseTitle: course.title,
          amount,
          reason: 'Simulated payment failure for testing',
        });

        res.status(200).json({
          success: false,
          message: 'Payment simulation failed. Check your email for details.',
          paymentId: payment.id,
        });
      }
    } catch (error) {
      console.error('Payment simulation error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export const paymentController = new PaymentController();
