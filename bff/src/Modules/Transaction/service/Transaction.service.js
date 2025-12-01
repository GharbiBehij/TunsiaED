// src/modules/Transaction/service/Transaction.service.js
import { transactionRepository } from '../repository/Transaction.repository.js';
import { paymentRepository } from '../../payment/repository/Payment.repository.js';
import { TransactionPermission } from './TransactionPermission.js';

export class TransactionService {
  async createTransaction(user, data) {
    const payment = await paymentRepository.findByPaymentId(data.paymentId);
    if (!payment) throw new Error('Payment not found');

    if (!TransactionPermission.create(user, payment)) {
      throw new Error('Unauthorized');
    }

    const transaction = await transactionRepository.createTransaction({
      paymentId: data.paymentId,
      userId: user.uid,
      courseId: payment.courseId,
      transactionType: data.transactionType || 'course_purchase',
      amount: payment.amount,
      currency: payment.currency || 'TND',
      status: 'pending',
      paymentGateway: data.paymentGateway || null,
      gatewayTransactionId: data.gatewayTransactionId || null,
      description: data.description || null,
    });

    await paymentRepository.updatePayment(data.paymentId, {
      status: 'completed',
      transactionId: transaction.transactionId,
    });

    return transaction;
  }

  async getTransactionById(transactionId) {
    return await transactionRepository.findByTransactionId(transactionId);
  }

  async updateTransaction(transactionId, user, data) {
    if (!TransactionPermission.update(user)) {
      throw new Error('Unauthorized');
    }

    const updated = await transactionRepository.updateTransaction(transactionId, data);

    if (data.status) {
      await paymentRepository.updatePayment(updated.paymentId, {
        status: data.status,
        transactionId,
      });
    }

    return updated;
  }

  async getTransactionsByPayment(paymentId) {
    return await transactionRepository.findTransactionsByPayment(paymentId);
  }

  async getUserTransactions(userId) {
    return await transactionRepository.findTransactionsByUser(userId);
  }

  async getCourseTransactions(courseId) {
    return await transactionRepository.findTransactionsByCourse(courseId);
  }

  async getTransactionsByStatus(status) {
    return await transactionRepository.findTransactionsByStatus(status);
  }
}

export const transactionService = new TransactionService();