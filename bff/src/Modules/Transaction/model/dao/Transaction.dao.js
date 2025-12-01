// src/modules/Transaction/model/dao/Transaction.dao.js
import { db } from '../../../../config/firebase.js';

export class TransactionDao {
  async createTransaction(data) {
    const docRef = await db.collection('transactions').add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { transactionId: docRef.id, ...data };
  }

  async getTransactionById(transactionId) {
    const doc = await db.collection('transactions').doc(transactionId).get();
    return doc.exists ? { transactionId: doc.id, ...doc.data() } : null;
  }

  async updateTransaction(transactionId, data) {
    await db.collection('transactions').doc(transactionId).update({
      ...data,
      updatedAt: new Date(),
    });
    const doc = await db.collection('transactions').doc(transactionId).get();
    return doc.exists ? { transactionId: doc.id, ...doc.data() } : null;
  }

  async getTransactionsByPayment(paymentId) {
    const snapshot = await db.collection('transactions')
      .where('paymentId', '==', paymentId)
      .get();
    return snapshot.docs.map(doc => ({ transactionId: doc.id, ...doc.data() }));
  }

  async getTransactionsByUser(userId) {
    const snapshot = await db.collection('transactions')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map(doc => ({ transactionId: doc.id, ...doc.data() }));
  }

  async getTransactionsByCourse(courseId) {
    const snapshot = await db.collection('transactions')
      .where('courseId', '==', courseId)
      .get();
    return snapshot.docs.map(doc => ({ transactionId: doc.id, ...doc.data() }));
  }

  async getTransactionsByStatus(status) {
    const snapshot = await db.collection('transactions')
      .where('status', '==', status)
      .get();
    return snapshot.docs.map(doc => ({ transactionId: doc.id, ...doc.data() }));
  }
}

export const transactionDao = new TransactionDao();