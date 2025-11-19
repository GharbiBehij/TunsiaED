// src/modules/Transaction/repository/Transaction.repository.js
import { transactionDao } from '../model/dao/Transaction.dao.js';
import { Transaction } from '../model/entity/Transaction.entity.js';

export class TransactionRepository {
  async createTransaction(userId, courseId, data) {
    const raw = await transactionDao.createTransaction(userId, courseId, data);

    return new Transaction(
      raw.transactionId,
      raw.paymentId,
      raw.userId,
      raw.courseId,
      raw.transactionType,
      raw.amount,
      raw.currency,
      raw.status,
      raw.paymentGateway || undefined,
      raw.gatewayTransactionId || undefined,
      raw.description || undefined,
      new Date(raw.createdAt),
      new Date(raw.updatedAt)
    );
  }

  async findByTransactionId(transactionId) {
    try {
      const doc = await transactionDao.getTransactionById(transactionId);
      if (!doc) return null;

      return new Transaction(
        transactionId,
        doc.paymentId,
        doc.userId,
        doc.courseId,
        doc.transactionType,
        doc.amount,
        doc.currency,
        doc.status,
        doc.paymentGateway || undefined,
        doc.gatewayTransactionId || undefined,
        doc.description || undefined,
        new Date(doc.createdAt),
        new Date(doc.updatedAt)
      );
    } catch {
      return null;
    }
  }

  async updateTransaction(transactionId, data) {
    try {
      const doc = await transactionDao.updateTransaction(transactionId, data);
      if (!doc) return null;

      return new Transaction(
        transactionId,
        doc.paymentId,
        doc.userId,
        doc.courseId,
        doc.transactionType,
        doc.amount,
        doc.currency,
        doc.status,
        doc.paymentGateway || undefined,
        doc.gatewayTransactionId || undefined,
        doc.description || undefined,
        new Date(doc.createdAt),
        new Date(doc.updatedAt)
      );
    } catch {
      return null;
    }
  }

  async findTransactionsByPayment(paymentId) {
    try {
      const docs = await transactionDao.getTransactionsByPayment(paymentId);
      return docs.map((doc) =>
        new Transaction(
          doc.transactionId,
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.transactionType,
          doc.amount,
          doc.currency,
          doc.status,
          doc.paymentGateway || undefined,
          doc.gatewayTransactionId || undefined,
          doc.description || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }

  async findTransactionsByUser(userId) {
    try {
      const docs = await transactionDao.getTransactionsByUser(userId);
      return docs.map((doc) =>
        new Transaction(
          doc.transactionId,
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.transactionType,
          doc.amount,
          doc.currency,
          doc.status,
          doc.paymentGateway || undefined,
          doc.gatewayTransactionId || undefined,
          doc.description || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }

  async findTransactionsByCourse(courseId) {
    try {
      const docs = await transactionDao.getTransactionsByCourse(courseId);
      return docs.map((doc) =>
        new Transaction(
          doc.transactionId,
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.transactionType,
          doc.amount,
          doc.currency,
          doc.status,
          doc.paymentGateway || undefined,
          doc.gatewayTransactionId || undefined,
          doc.description || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }

  async findTransactionsByStatus(status) {
    try {
      const docs = await transactionDao.getTransactionsByStatus(status);
      return docs.map((doc) =>
        new Transaction(
          doc.transactionId,
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.transactionType,
          doc.amount,
          doc.currency,
          doc.status,
          doc.paymentGateway || undefined,
          doc.gatewayTransactionId || undefined,
          doc.description || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }
}

export const transactionRepository = new TransactionRepository();

