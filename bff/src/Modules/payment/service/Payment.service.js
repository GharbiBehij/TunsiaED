// src/modules/payment/service/Payment.service.js
// Single-module operations only. Cross-module purchase flow is in CoursePurchase.orchestrator.js
import { paymentRepository } from '../repository/Payment.repository.js';
import { PaymentPermission } from './PaymentPermission.js';
import { PaymentMapper } from '../mapper/Payment.mapper.js';

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

  // Note: createPayment with course price lookup is in CoursePurchase.orchestrator.js
  // This method is for internal/admin use only
  async createPaymentInternal(paymentData) {
    PaymentMapper.validateCreate(paymentData);
    const raw = await paymentRepository.createPayment(paymentData);
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

  /**
   * Update payment (internal - bypasses permission for orchestrator)
   * @param {string} paymentId
   * @param {Object} updateData
   */
  async updatePaymentInternal(paymentId, updateData) {
    const raw = await paymentRepository.updatePayment(paymentId, updateData);
    return this._toModel(raw);
  }
}

export const paymentService = new PaymentService();