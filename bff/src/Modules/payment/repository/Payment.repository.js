// src/modules/payment/repository/Payment.repository.js
import { paymentDao } from '../Model/dao/Payment.dao.js';

export class PaymentRepository {
  async createPayment(paymentData) {
    return await paymentDao.createPayment(paymentData);
  }

  async findByPaymentId(paymentId) {
    return await paymentDao.getPaymentById(paymentId);
  }

  async updatePayment(paymentId, updateData) {
    return await paymentDao.updatePayment(paymentId, updateData);
  }

  async findPaymentsByUser(userId) {
    return await paymentDao.getPaymentsByUser(userId);
  }

  async findPaymentsByCourse(courseId) {
    return await paymentDao.getPaymentsByCourse(courseId);
  }

  async findPaymentsByStatus(status) {
    return await paymentDao.getPaymentsByStatus(status);
  }

  async findByStripeSessionId(sessionId) {
    return await paymentDao.findByStripeSessionId(sessionId);
  }

  async findByPaymeeToken(token) {
    return await paymentDao.findByPaymeeToken(token);
  }
}

export const paymentRepository = new PaymentRepository();