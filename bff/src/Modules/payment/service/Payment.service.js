// src/modules/payment/service/Payment.service.js
// Single-module operations only. Cross-module purchase flow is in CoursePurchase.orchestrator.js
import { paymentRepository } from '../repository/Payment.repository.js';
import { PaymentPermission } from './PaymentPermission.js';
import { PaymentMapper } from '../mapper/Payment.mapper.js';
import { stripeService } from './StripeService.js';

export class PaymentService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? PaymentMapper.toModel(raw.paymentId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => PaymentMapper.toModel(raw.paymentId, raw));
  }

  _toEntity(model) {
    return PaymentMapper.toEntity(model);
  }

  _toEntityUpdate(model) {
    return PaymentMapper.toEntityUpdate(model);
  }

  // Create payment (for direct API calls)
  async createPayment(userId, paymentData) {
    // Add userId to payment data
    const dataWithUser = { ...paymentData, userId };
    PaymentMapper.validateCreate(dataWithUser);
    const entity = PaymentMapper.toEntity(dataWithUser);
    const raw = await paymentRepository.createPayment(entity);
    return this._toModel(raw);
  }

  // Note: createPayment with course price lookup is in CoursePurchase.orchestrator.js
  // This method is for internal/admin use only
  async createPaymentInternal(paymentData) {
    PaymentMapper.validateCreate(paymentData);
    const entity = PaymentMapper.toEntity(paymentData);
    const raw = await paymentRepository.createPayment(entity);
    return this._toModel(raw);
  }

  // Update payment (internal - bypasses permission for orchestrator)
  async updatePaymentInternal(paymentId, updateData) {
    const raw = await paymentRepository.updatePayment(paymentId, updateData);
    return this._toModel(raw);
  }

  async getPaymentById(paymentId) {
    const raw = await paymentRepository.findByPaymentId(paymentId);
    return this._toModel(raw);
  }

  async updatePayment(paymentId, user, updateData) {
    if (!PaymentPermission.update(user)) {
      throw new Error('Unauthorized');
    }
    const raw = await paymentRepository.updatePayment(paymentId, updateData);
    return this._toModel(raw);
  }

  async getUserPayments(userId) {
    const rawList = await paymentRepository.findPaymentsByUser(userId);
    return this._toModels(rawList);
  }

  async getCoursePayments(courseId) {
    const rawList = await paymentRepository.findPaymentsByCourse(courseId);
    return this._toModels(rawList);
  }

  async getPaymentsByStatus(status) {
    const rawList = await paymentRepository.findPaymentsByStatus(status);
    return this._toModels(rawList);
  }

  // Paymee webhook calls this
  async confirmPayment(paymentId, transactionId) {
    return await this.updatePayment(paymentId, { isAdmin: true }, {
      status: 'completed',
      transactionId,
    });
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get payment by ID (internal - bypasses permission for orchestrator)
   * @param {string} paymentId
   */
  async getPaymentByIdInternal(paymentId) {
    const raw = await paymentRepository.findByPaymentId(paymentId);
    return this._toModel(raw);
  }

  // ====================================================================
  // STRIPE INTEGRATION METHODS
  // These methods handle Stripe payment gateway operations
  // ====================================================================

  /**
   * Initiate a Stripe payment
   * Creates internal payment record and initiates Stripe checkout
   * @param {string} userId - User ID
   * @param {Object} paymentData - Payment data
   * @param {Object} stripeData - Stripe-specific data
   * @returns {Object} Combined payment and Stripe data
   */
  async initiateStripePayment(userId, paymentData, stripeData) {
    // Step 1: Create internal payment record
    const internalPayment = await this.createPayment(userId, {
      ...paymentData,
      paymentMethod: 'stripe',
      status: 'pending',
    });

    try {
      // Step 2: Initiate Stripe payment
      const stripeResult = await stripeService.initiatePayment({
        amount: paymentData.amount,
        note: stripeData.note || `Payment: ${paymentData.courseId || 'N/A'}`,
        firstName: stripeData.firstName || 'Customer',
        lastName: stripeData.lastName || 'User',
        email: stripeData.email,
        phone: stripeData.phone || '+21600000000',
        orderId: internalPayment.id, // Link to our internal payment ID
      });

      // Step 3: Update internal payment with Stripe session ID
      await this.updatePaymentInternal(internalPayment.id, {
        stripeSessionId: stripeResult.token,
        checkoutUrl: stripeResult.paymentUrl,
      });

      return {
        success: true,
        paymentId: internalPayment.id,
        sessionId: stripeResult.token,
        checkoutUrl: stripeResult.paymentUrl,
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
      };
    } catch (stripeError) {
      // Mark payment as failed if Stripe initiation fails
      await this.updatePaymentInternal(internalPayment.id, {
        status: 'failed',
        failureReason: stripeError.message,
      });
      throw stripeError;
    }
  }

  /**
   * Verify Stripe webhook signature
   * Validates webhook authenticity using Stripe signature
   * @param {string} payload - Raw request body
   * @param {string} signature - Stripe-Signature header
   * @returns {Object} Verified webhook event
   */
  async verifyStripeWebhook(payload, signature) {
    return await stripeService.verifyWebhook(payload, signature);
  }

  /**
   * Process Stripe webhook
   * Handles payment status updates from Stripe
   * @param {Object} webhookData - Raw webhook data from Stripe
   * @returns {Object} Processed webhook result
   */
  async processStripeWebhook(webhookData) {
    return await stripeService.processWebhook(webhookData);
  }

  /**
   * Get Stripe payment status
   * Checks payment status by session ID
   * @param {string} sessionId - Stripe session ID
   * @returns {Object} Payment status data
   */
  async getStripePaymentStatus(sessionId) {
    // Find internal payment by Stripe session ID
    const raw = await paymentRepository.findByStripeSessionId(sessionId);
    return this._toModel(raw);
  }

  /**
   * Confirm Stripe payment
   * Updates payment status after successful Stripe payment
   * @param {string} paymentId - Internal payment ID
   * @param {string} stripeTransactionId - Stripe transaction ID
   * @returns {Object} Updated payment data
   */
  async confirmStripePayment(paymentId, stripeTransactionId) {
    return await this.updatePaymentInternal(paymentId, {
      status: 'completed',
      transactionId: stripeTransactionId,
      completedAt: new Date(),
    });
  }

  /**
   * Handle Stripe payment failure
   * Updates payment status after failed Stripe payment
   * @param {string} paymentId - Internal payment ID
   * @param {string} failureReason - Reason for failure
   * @returns {Object} Updated payment data
   */
  async failStripePayment(paymentId, failureReason) {
    return await this.updatePaymentInternal(paymentId, {
      status: 'failed',
      failureReason: failureReason,
      failedAt: new Date(),
    });
  }
}

export const paymentService = new PaymentService();