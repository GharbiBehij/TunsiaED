// bff/src/Modules/payment/Api/Payment.controller.js
// Uses orchestrators for cross-module operations
import { paymentService } from '../service/Payment.service.js';
import { coursePurchaseOrchestrator } from '../../../orchestrators/CoursePurchase.orchestrator.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { paymeeService } from '../service/PaymeeService.js';
import emailService from '../../../utils/EmailService.js';
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
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const purchaseData = req.body; // { courseId, paymentType, subscriptionType, paymentMethod }

      // Use orchestrator for cross-module purchase initiation
      const paymentData = await coursePurchaseOrchestrator.initiatePurchase(user, purchaseData);
      res.status(201).json(paymentData);
    } catch (error) {
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
   * PAYMEE GATEWAY ENDPOINTS
   * Tunisian payment gateway integration (https://www.paymee.tn)
   */

  /**
   * Initiate Paymee payment
   * Creates a payment record and returns Paymee gateway URL for iframe
   * @param {Object} req.body - { courseId, amount, note, firstName, lastName, email, phone }
   */
  async initiatePaymeePayment(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const { courseId, amount, note, firstName, lastName, email, phone } = req.body;

      // Step 1: Create internal payment record first
      const internalPayment = await paymentService.createPayment(userId, {
        courseId,
        amount,
        paymentType: 'course_purchase',
        paymentMethod: 'paymee',
        status: 'pending',
      });

      // Step 2: Initiate Paymee payment
      const paymeeResult = await paymeeService.initiatePayment({
        amount,
        note: note || `Course Purchase: ${courseId}`,
        firstName: firstName || user.firstName || 'Customer',
        lastName: lastName || user.lastName || 'User',
        email: email || user.email,
        phone: phone || user.phone || '+21600000000',
        orderId: internalPayment.id, // Link to our internal payment ID
      });

      // Step 3: Update internal payment with Paymee token
      await paymentService.updatePayment(internalPayment.id, {
        paymeeToken: paymeeResult.token,
        gatewayUrl: paymeeResult.gatewayUrl,
      });

      res.status(201).json({
        success: true,
        paymentId: internalPayment.id,
        paymeeToken: paymeeResult.token,
        gatewayUrl: paymeeResult.gatewayUrl,
        amount: paymeeResult.amount,
      });
    } catch (error) {
      console.error('Paymee initiation error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle Paymee webhook
   * Receives payment status from Paymee after payment attempt
   * No authentication - verified by checksum
   * Sends email notification to user on success/failure
   */
  async handlePaymeeWebhook(req, res) {
    try {
      console.log('Paymee webhook received:', req.body);

      // Process and verify webhook data
      const webhookResult = paymeeService.processWebhook(req.body);

      // Get internal payment by order_id (which is our paymentId)
      const payment = await paymentService.getPaymentById(webhookResult.orderId);
      
      if (!payment) {
        console.error('Payment not found for Paymee webhook:', webhookResult.orderId);
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Get user and course info for email
      const user = await userRepository.findByUid(payment.userId);
      const course = await courseService.getCourseById(payment.courseId);
      const courseTitle = course?.title || 'Course Purchase';

      if (webhookResult.success) {
        // Payment successful - complete the purchase using orchestrator
        const confirmationData = {
          paymentId: payment.id,
          gatewayTransactionId: String(webhookResult.transactionId),
          paymentGateway: 'paymee',
        };

        await coursePurchaseOrchestrator.completePurchase(user, confirmationData);

        // Send success email
        await emailService.sendPaymentSuccessEmail({
          email: user.email,
          firstName: user.firstName || webhookResult.customer?.firstName || 'Customer',
          lastName: user.lastName || webhookResult.customer?.lastName || '',
          courseTitle,
          amount: webhookResult.amount,
          transactionId: String(webhookResult.transactionId),
          paymentMethod: 'Paymee',
        });

        console.log('Paymee payment completed successfully:', webhookResult.orderId);
      } else {
        // Payment failed - update payment status
        await paymentService.updatePayment(payment.id, {
          status: 'failed',
          failureReason: 'Payment declined by Paymee',
        });

        // Send failure email
        await emailService.sendPaymentFailedEmail({
          email: user.email,
          firstName: user.firstName || webhookResult.customer?.firstName || 'Customer',
          lastName: user.lastName || webhookResult.customer?.lastName || '',
          courseTitle,
          amount: payment.amount,
          reason: 'Payment was declined or cancelled',
        });

        console.log('Paymee payment failed:', webhookResult.orderId);
      }

      // Always respond 200 to Paymee
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Paymee webhook error:', error);
      // Still respond 200 to avoid Paymee retries
      res.status(200).json({ received: true, error: error.message });
    }
  }

  /**
   * Get Paymee payment status by token
   * Used to check payment status on frontend after iframe completion
   */
  async getPaymeePaymentStatus(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { token } = req.params;

      // Find payment by Paymee token
      const payments = await paymentService.getUserPayments(userId);
      const payment = payments.find(p => p.paymeeToken === token);

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
   * Simulate Payment (for testing while Paymee sandbox is down)
   * Creates payment, completes it, and sends email notification
   * @param {Object} req.body - { courseId, amount, simulateSuccess: true/false }
   */
  async simulatePayment(req, res) {
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
        const payment = await paymentService.createPayment(userId, {
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

        // Step 3: Send success email
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
        const payment = await paymentService.createPayment(userId, {
          courseId,
          amount,
          paymentType: 'course_purchase',
          paymentMethod: 'simulation',
          status: 'failed',
        });

        // Send failure email
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
