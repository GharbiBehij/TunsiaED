// src/modules/Transaction/service/Transaction.service.js
import { transactionRepository } from '../repository/Transaction.repository.js';
import { TransactionMapper } from '../mapper/Transaction.mapper.js';
import { paymentRepository } from '../../payment/repository/Payment.repository.js';
import { canCreateTransaction, canUpdateTransaction } from './TransactionPermission.js';

export class TransactionService {
  async createTransaction(
    user,
    data
  ) {
    // Validate payment exists
    const payment = await paymentRepository.findByPaymentId(data.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Validate payment belongs to user
    if (!canCreateTransaction(user, payment)) {
      throw new Error('Unauthorized: Payment does not belong to user');
    }

    // Get courseId from payment
    const courseId = payment.courseId;

    const transaction = await transactionRepository.createTransaction(
      user.uid,
      courseId,
      data
    );

    // Update payment with transaction ID
    await paymentRepository.updatePayment(data.paymentId, { status: 'completed' }, transaction.transactionId);

    return TransactionMapper.toResponse(transaction, 'Transaction created successfully');
  }

  async getTransactionById(transactionId){
    const transaction = await transactionRepository.findByTransactionId(transactionId);
    if (!transaction) return null;

    return TransactionMapper.toResponse(transaction, 'Transaction retrieved successfully');
  }

  async updateTransaction(
    transactionId,
    user,
    data,
  ){
    if (!canUpdateTransaction(user)) {
      throw new Error('Unauthorized');
    }

    const updatedTransaction = await transactionRepository.updateTransaction(
      transactionId,
      data
    );
    if (!updatedTransaction) return null;

    // If transaction status changed to completed, update payment status
    if (data.status === 'completed') {
      await paymentRepository.updatePayment(updatedTransaction.paymentId, { status: 'completed' }, transactionId);
    } else if (data.status === 'failed') {
      await paymentRepository.updatePayment(updatedTransaction.paymentId, { status: 'failed' });
    }

    return TransactionMapper.toResponse(updatedTransaction, 'Transaction updated successfully');
  }

  async getTransactionsByPayment(paymentId){
    const transactions = await transactionRepository.findTransactionsByPayment(paymentId);
    return transactions.map((transaction) =>
      TransactionMapper.toResponse(transaction, 'Transactions retrieved successfully')
    );
  }

  async getUserTransactions(userId){
    const transactions = await transactionRepository.findTransactionsByUser(userId);
    return transactions.map((transaction) =>
      TransactionMapper.toResponse(transaction, 'Transactions retrieved successfully')
    );
  }

  async getCourseTransactions(courseId){
    const transactions = await transactionRepository.findTransactionsByCourse(courseId);
    return transactions.map((transaction) =>
      TransactionMapper.toResponse(transaction, 'Transactions retrieved successfully')
    );
  }

  async getTransactionsByStatus(status) {
    const transactions = await transactionRepository.findTransactionsByStatus(status);
    return transactions.map((transaction) =>
      TransactionMapper.toResponse(transaction, 'Transactions retrieved successfully')
    );
  }
}

export const transactionService = new TransactionService();

