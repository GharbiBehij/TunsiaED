// src/modules/Transaction/repository/Transaction.repository.js
import { transactionDao } from '../model/dao/Transaction.dao.js';

export class TransactionRepository {
  async createTransaction(data) {
    return await transactionDao.createTransaction(data);
  }

  async findByTransactionId(transactionId) {
    return await transactionDao.getTransactionById(transactionId);
  }

  async updateTransaction(transactionId, data) {
    return await transactionDao.updateTransaction(transactionId, data);
  }

  async findTransactionsByPayment(paymentId) {
    return await transactionDao.getTransactionsByPayment(paymentId);
  }

  async findTransactionsByUser(userId) {
    return await transactionDao.getTransactionsByUser(userId);
  }

  async findTransactionsByCourse(courseId) {
    return await transactionDao.getTransactionsByCourse(courseId);
  }

  async findTransactionsByStatus(status) {
    return await transactionDao.getTransactionsByStatus(status);
  }
}

export const transactionRepository = new TransactionRepository();