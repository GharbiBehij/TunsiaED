// src/modules/payment/repository/Payment.repository.js
import { paymentDao } from '../Model/dao/Payment.dao.js';
import { Payment } from '../Model/entity/Payment.entity.js';

export class PaymentRepository {
  async createPayment(userId, data) {
    const raw = await paymentDao.createPayment(userId, data);

    return new Payment(
      raw.paymentId,
      raw.userId,
      raw.courseId,
      raw.amount,
      raw.currency,
      raw.paymentType,
      raw.subscriptionType || undefined,
      raw.paymentMethod,
      raw.status,
      raw.transactionId || undefined,
      new Date(raw.createdAt),
      new Date(raw.updatedAt)
    );
  }

  async findByPaymentId(paymentId) {
    try {
      const doc = await paymentDao.getPaymentById(paymentId);
      if (!doc) return null;

      return new Payment(
        paymentId,
        doc.userId,
        doc.courseId,
        doc.amount,
        doc.currency,
        doc.paymentType,
        doc.subscriptionType || undefined,
        doc.paymentMethod,
        doc.status,
        doc.transactionId || undefined,
        new Date(doc.createdAt),
        new Date(doc.updatedAt)
      );
    } catch {
      return null;
    }
  }

  async updatePayment(paymentId, data, transactionId) {
    try {
      const doc = await paymentDao.updatePayment(paymentId, data, transactionId);
      if (!doc) return null;

      return new Payment(
        paymentId,
        doc.userId,
        doc.courseId,
        doc.amount,
        doc.currency,
        doc.paymentType,
        doc.subscriptionType || undefined,
        doc.paymentMethod,
        doc.status,
        doc.transactionId || undefined,
        new Date(doc.createdAt),
        new Date(doc.updatedAt)
      );
    } catch {
      return null;
    }
  }

  async findPaymentsByUser(userId) {
    try {
      const docs = await paymentDao.getPaymentsByUser(userId);
      return docs.map((doc) =>
        new Payment(
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.amount,
          doc.currency,
          doc.paymentType,
          doc.subscriptionType || undefined,
          doc.paymentMethod,
          doc.status,
          doc.transactionId || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }

  async findPaymentsByCourse(courseId) {
    try {
      const docs = await paymentDao.getPaymentsByCourse(courseId);
      return docs.map((doc) =>
        new Payment(
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.amount,
          doc.currency,
          doc.paymentType,
          doc.subscriptionType || undefined,
          doc.paymentMethod,
          doc.status,
          doc.transactionId || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }

  async findPaymentsByStatus(status) {
    try {
      const docs = await paymentDao.getPaymentsByStatus(status);
      return docs.map((doc) =>
        new Payment(
          doc.paymentId,
          doc.userId,
          doc.courseId,
          doc.amount,
          doc.currency,
          doc.paymentType,
          doc.subscriptionType || undefined,
          doc.paymentMethod,
          doc.status,
          doc.transactionId || undefined,
          new Date(doc.createdAt),
          new Date(doc.updatedAt)
        )
      );
    } catch {
      return [];
    }
  }
}

export const paymentRepository = new PaymentRepository();

