// bff/src/Modules/payment/Api/Payment.controller.js
// Uses orchestrators for cross-module operations
import { paymentService } from '../service/Payment.service.js';
import { coursePurchaseOrchestrator } from '../../../orchestrators/CoursePurchase.orchestrator.js';
import { userService } from '../../User/service/User.service.js';
import { courseService } from '../../Course/service/Course.service.js';
import emailService from '../../../utils/EmailService.js';

export class PaymentController {
  // ===== DIRECT SERVICE ROUTES =====

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

  async getCoursePayments(req, res) {
    try {
      const { courseId } = req.params;
      const payments = await paymentService.getCoursePayments(courseId);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPaymentsByStatus(req, res) {
    try {
      const { status } = req.params;
      const payments = await paymentService.getPaymentsByStatus(status);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // ===== ORCHESTRATED ROUTES =====

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

      const user = await userService.getUserByUidInternal(userId);
      const purchaseData = req.body;

      const paymentData = await coursePurchaseOrchestrator.initiatePurchase(user, purchaseData);
      console.log(`✅ [${requestId}] Payment initiated successfully:`, paymentData.paymentId);
      res.status(201).json(paymentData);
    } catch (error) {
      console.log(`❌ [${requestId}] Payment initiation failed:`, error.message);
      if (error.message.includes('not found') || error.message.includes('already enrolled')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async completePurchase(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const confirmationData = req.body; // { paymentId, gatewayTransactionId, paymentGateway }

      const result = await coursePurchaseOrchestrator.completePurchase(user, confirmationData);

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

  async getPurchaseStatus(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const { paymentId } = req.params;

      const statusData = await coursePurchaseOrchestrator.getPurchaseStatus(user, paymentId);
      res.status(200).json(statusData);
    } catch (error) {
      if (error.message === 'Unauthorized' || error.message.includes('not found')) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // ===== PAYMEE GATEWAY ROUTES (replacing Stripe) =====

  /**
   * Initiate Paymee payment
   * Uses orchestrator for proper flow: Controller → Orchestrator → PaymentService → Paymee
   * @param {Object} req.body - { paymentId, note, firstName, lastName, email, phone }
   */
  async initiatePayment(req, res) {
    const requestId = `REQ_${Date.now()}`;
    console.log(`🚀 [${requestId}] Paymee payment initiation started`);
    
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

      const result = await coursePurchaseOrchestrator.initiatePaymeeCheckout(user, paymentId, {
        note: note || 'Course Purchase',
        firstName: firstName || user.firstName || 'Customer',
        lastName: lastName || user.lastName || 'User',
        email: email || user.email,
        phone: phone || user.phone || '+21600000000',
      });

      console.log(`✅ [${requestId}] Paymee payment initiated successfully:`, result.paymentId);
      res.status(201).json(result);
    } catch (error) {
      console.error('Paymee initiation error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle Paymee webhook
   * Receives payment status from Paymee after payment attempt
   * No authentication - integrity verified via checksum in PaymeeService
   */
  async processWebhook(req, res) {
    const webhookId = `WHK_${Date.now()}`;
    console.log(`🔔 [${webhookId}] Paymee webhook received:`, {
      timestamp: new Date().toISOString()
    });

    try {
      const webhookData = req.body;

      console.log(`🔄 [${webhookId}] Processing webhook through orchestrator...`);
      const { verified, webhookResult } = await coursePurchaseOrchestrator.processPaymeeWebhook(webhookData);

      console.log(`✅ [${webhookId}] Orchestrator webhook processing complete:`, {
        verified,
        success: webhookResult.success,
        orderId: webhookResult.orderId,
        transactionId: webhookResult.transactionId
      });

      console.log(`🔍 [${webhookId}] Looking up payment:`, webhookResult.orderId);
      const payment = await paymentService.getPaymentById(webhookResult.orderId);
      
      if (!payment) {
        console.error(`❌ [${webhookId}] Payment not found:`, webhookResult.orderId);
        return res.status(404).json({ error: 'Payment not found' });
      }
      console.log(`✅ [${webhookId}] Payment found:`, {
        paymentId: payment.paymentId,
        status: payment.status,
        userId: payment.userId,
        courseId: payment.courseId
      });

      if (payment.status === 'completed') {
        console.log(`⚠️  [${webhookId}] Idempotency check: Payment already completed:`, {
          paymentId: webhookResult.orderId,
          status: payment.status,
          message: 'Duplicate webhook ignored'
        });
        return res.status(200).json({ received: true, message: 'Already processed' });
      }

      console.log(`🔄 [${webhookId}] Delegating to orchestrator for completion...`);
      const completionResult = await coursePurchaseOrchestrator.handleWebhookCompletion(webhookResult, payment);
      
      if (completionResult.success) {
        console.log(`🎉 [${webhookId}] Paymee payment completed successfully:`, webhookResult.orderId);
      } else {
        console.log(`❌ [${webhookId}] Paymee payment failed:`, webhookResult.orderId);
      }

      console.log(`✅ [${webhookId}] Webhook processing complete - responding to Paymee`);
      res.status(200).json({ received: true });
    } catch (error) {
      console.error(`💥 [${webhookId}] Paymee webhook error:`, {
        error: error.message,
        stack: error.stack
      });
      // Always respond 200 so Paymee doesn't hammer retries; you can refine this if their docs recommend otherwise
      res.status(200).json({ received: true, error: error.message });
    }
  }

  /**
   * Get Paymee payment status by token
   * For Paymee, you typically track by our own payment, not the gateway token.
   * Here we assume token is stored as paymeeToken in payment document.
   */
  async getPaymentStatus(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { token } = req.params;

      // Find internal payment by Paymee token
      const raw = await paymentRepository.findByPaymeeToken(token);
      const payment = raw ? paymentService._toModel(raw) : null;

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json({
        paymentId: payment.paymentId,
        status: payment.status,
        courseId: payment.courseId,
        amount: payment.amount,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // ===== SIMULATION (unchanged) =====

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

      const course = await courseService.getCourseById(courseId);
      console.log('📚 [PaymentSim] Course details:', course);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      const amount = course.price || 0;
      const transactionId = `SIM_${Date.now()}`;

      if (simulateSuccess) {
        const payment = await paymentService.createPaymentInternal({
          userId,
          courseId,
          amount,
          paymentType: 'course_purchase',
          paymentMethod: 'simulation',
          status: 'pending',
        });
        console.log('💳 [PaymentSim] Payment created with ID:', payment.paymentId);

        const confirmationData = {
          paymentId: payment.paymentId,
          gatewayTransactionId: transactionId,
          paymentGateway: 'simulation',
        };
        const result = await coursePurchaseOrchestrator.completePurchase(user, confirmationData);

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
          paymentId: payment.paymentId,
          transactionId,
          enrollment: result.enrollment,
        });
      } else {
        const payment = await paymentService.createPaymentInternal({
          userId,
          courseId,
          amount,
          paymentType: 'course_purchase',
          paymentMethod: 'simulation',
          status: 'failed',
        });

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
          paymentId: payment.paymentId,
        });
      }
    } catch (error) {
      console.error('Payment simulation error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export const paymentController = new PaymentController();
