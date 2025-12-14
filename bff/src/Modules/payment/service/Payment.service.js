// src/Modules/payment/service/Payment.service.js
// Single-module operations only. Cross-module purchase flow is in CoursePurchase.orchestrator.js
import { paymentRepository } from '../repository/Payment.repository.js';
import { PaymentPermission } from './PaymentPermission.js';
import { PaymentMapper } from '../mapper/Payment.mapper.js';
import { paymeeService } from './PaymeeService.js';

export class PaymentService {
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

  async createPayment(userId, paymentData) {
    const dataWithUser = { ...paymentData, userId };
    PaymentMapper.validateCreate(dataWithUser);
    const entity = PaymentMapper.toEntity(dataWithUser);
    const raw = await paymentRepository.createPayment(entity);
    return this._toModel(raw);
  }

  async createPaymentInternal(paymentData) {
    PaymentMapper.validateCreate(paymentData);
    const entity = PaymentMapper.toEntity(paymentData);
    const raw = await paymentRepository.createPayment(entity);
    return this._toModel(raw);
  }

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

  // Paymee webhook (legacy direct usage)
  async confirmPayment(paymentId, transactionId) {
    return await this.updatePayment(paymentId, { isAdmin: true }, {
      status: 'completed',
      transactionId,
    });
  }

  async getPaymentByIdInternal(paymentId) {
    const raw = await paymentRepository.findByPaymentId(paymentId);
    return this._toModel(raw);
  }

  // ====================================================================
  // PAYMEE INTEGRATION METHODS
  // ====================================================================

  /**
   * Initiate Paymee payment for an existing payment record
   * Updates existing payment with Paymee token & checkout URL
   */
  async initiatePaymeePaymentForExistingPayment(userId, paymentId, gatewayData) {
    const payment = await this.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    if (payment.userId !== userId) {
      throw new Error('Unauthorized: Payment does not belong to this user');
    }
    if (payment.status === 'completed') {
      throw new Error('Payment already completed');
    }

    try {
      const paymeeResult = await paymeeService.initiatePayment({
        amount: payment.amount,
        note: gatewayData.note || `Payment: ${payment.courseTitle || 'Course Purchase'}`,
        firstName: gatewayData.firstName || 'Customer',
        lastName: gatewayData.lastName || 'User',
        email: gatewayData.email,
        phone: gatewayData.phone || '+21600000000',
        orderId: payment.paymentId,
      });

      await this.updatePaymentInternal(payment.paymentId, {
        paymeeToken: paymeeResult.token,
        checkoutUrl: paymeeResult.paymentUrl,
        paymentMethod: 'paymee',
        status: 'pending',
      });

      return {
        success: true,
        paymentId: payment.paymentId,
        sessionId: paymeeResult.token,
        checkoutUrl: paymeeResult.paymentUrl,
        amount: payment.amount,
        currency: payment.currency || 'TND',
      };
    } catch (err) {
      await this.updatePaymentInternal(payment.paymentId, {
        status: 'failed',
        failureReason: err.message,
      });
      throw err;
    }
  }

  /**
   * Process Paymee webhook: verify checksum and normalize
   */
  async processPaymeeWebhook(webhookData) {
    return paymeeService.processWebhook(webhookData);
  }
}

export const paymentService = new PaymentService();
