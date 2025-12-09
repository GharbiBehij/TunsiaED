// bff/src/Modules/payment/Api/Payment.controller.js
// Uses orchestrators for cross-module operations
import { paymentService } from '../service/Payment.service.js';
import { coursePurchaseOrchestrator } from '../../../orchestrators/CoursePurchase.orchestrator.js';
import { userRepository } from '../../User/repository/User.repository.js';

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
      
      const result = await paymentService.updatePayment(paymentId, req.user, data);
      
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
   * Uses orchestrator for proper flow: Controller → Orchestrator → Service → Stripe
   * @param {Object} req.body - { paymentId, note, firstName, lastName, email, phone }
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
      const { paymentId, note, firstName, lastName, email, phone } = req.body;

      if (!paymentId) {
        return res.status(400).json({ error: 'paymentId is required' });
      }

      // Use orchestrator for Stripe checkout session creation
      const result = await coursePurchaseOrchestrator.initiateStripeCheckout(user, paymentId, {
        note: note || 'Course Purchase',
        firstName: firstName || user.firstName || 'Customer',
        lastName: lastName || user.lastName || 'User',
        email: email || user.email,
        phone: phone || user.phone || '+21600000000',
      });

      console.log(`✅ [${requestId}] Stripe payment initiated successfully:`, result.paymentId);
      res.status(201).json(result);
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
      hasSignature: !!req.headers['stripe-signature'],
      timestamp: new Date().toISOString()
    });

    try {
      // Verify webhook signature first
      const signature = req.headers['stripe-signature'];
      if (!signature) {
        console.error(`❌ [${webhookId}] Missing Stripe signature`);
        return res.status(400).json({ error: 'Missing signature' });
      }

      // req.body is raw buffer from express.raw() middleware
      const payload = req.body.toString('utf8');
      
      // Process webhook through orchestrator (handles verification + processing)
      console.log(`🔄 [${webhookId}] Processing webhook through orchestrator...`);
      const { verified, event, webhookResult } = await coursePurchaseOrchestrator.processStripeWebhook(payload, signature);
      
      console.log(`✅ [${webhookId}] Orchestrator webhook processing complete:`, {
        verified,
        eventType: event.type,
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

      // Handle completion through orchestrator (handles user lookup, course lookup, emails)
      console.log(`🔄 [${webhookId}] Delegating to orchestrator for completion...`);
      const completionResult = await coursePurchaseOrchestrator.handleWebhookCompletion(webhookResult, payment);
      
      if (completionResult.success) {
        console.log(`🎉 [${webhookId}] Stripe payment completed successfully:`, webhookResult.orderId);
      } else {
        console.log(`❌ [${webhookId}] Stripe payment failed:`, webhookResult.orderId);
      }

      // Always respond 200 to Stripe
      console.log(`✅ [${webhookId}] Webhook processing complete - responding to Stripe`);
      res.status(200).json({ received: true });
    } catch (error) {
      console.error(`💥 [${webhookId}] Stripe webhook error:`, {
        error: error.message,
        stack: error.stack
      });
      
      // Signature verification failed - reject immediately
      if (error.message.includes('signature') || error.message.includes('Webhook')) {
        return res.status(400).json({ error: 'Invalid signature' });
      }
      
      // Database or transient errors - let Stripe retry
      if (error.message.includes('Database') || error.message.includes('timeout')) {
        console.log(`🔄 [${webhookId}] Transient error - Stripe will retry`);
        return res.status(500).json({ error: 'Retry later' });
      }
      
      // Other errors - respond 200 to prevent endless retries
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

      // Use payment service to get Stripe payment status
      const payment = await paymentService.getStripePaymentStatus(token);

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
console.log('🚀 [PaymentSim] Simulating payment with data:', req.body);
    try {
      const userId = req.user?.uid;
      console.log('👤 [PaymentSim] Authenticated user ID:', userId);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      console.log('✅ [PaymentSim] User found:', user.email); 
      const { courseId, simulateSuccess = true } = req.body;
      console.log('🎯 [PaymentSim] Course ID:', courseId, 'Simulate Success:', simulateSuccess);

      // Get course info
      const course = await courseService.getCourseById(courseId);
      console.log('📚 [PaymentSim] Course details:', course);
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
        console.log('💳 [PaymentSim] Payment created with ID:', payment.id);

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
          firstName: user.firstName || 'Student',
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
