// src/modules/Transaction/model/dao/Transaction.dao.js
import { db } from '../../../../config/firebase.js';

export class TransactionDao {
  async createTransaction(userId, courseId, data) {
    const transactionDoc = {
      paymentId: data.paymentId,
      userId,
      courseId,
      transactionType: data.transactionType,
      amount: data.amount,
      currency: data.currency || 'USD',
      status: 'pending',
      paymentGateway: data.paymentGateway || null,
      gatewayTransactionId: data.gatewayTransactionId || null,
      description: data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('transactions').add(transactionDoc);
    
    return {
      transactionId: docRef.id,
      ...transactionDoc,
    };
  }

  async getTransactionById(transactionId) {
    const doc = await db.collection('transactions').doc(transactionId).get();
    return doc.exists ? doc.data() : null;
  }

  async updateTransaction(transactionId, data) {
    const updateData = {
      updatedAt: new Date(),
    };

    if (data.status !== undefined) updateData.status = data.status;
    if (data.gatewayTransactionId !== undefined) updateData.gatewayTransactionId = data.gatewayTransactionId || null;
    if (data.description !== undefined) updateData.description = data.description || null;

    await db.collection('transactions').doc(transactionId).update(updateData);
    
    const updatedDoc = await db.collection('transactions').doc(transactionId).get();
    return updatedDoc.exists ? updatedDoc.data() : null;
  }

  async getTransactionsByPayment(paymentId) {
    const snapshot = await db
      .collection('transactions')
      .where('paymentId', '==', paymentId)
      .get();
    
    return snapshot.docs.map(doc => ({
      transactionId: doc.id,
      ...doc.data(),
    }));
  }

  async getTransactionsByUser(userId) {
    const snapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .get();
    
    return snapshot.docs.map(doc => ({
      transactionId: doc.id,
      ...doc.data(),
    }));
  }

  async getTransactionsByCourse(courseId) {
    const snapshot = await db
      .collection('transactions')
      .where('courseId', '==', courseId)
      .get();
    
    return snapshot.docs.map(doc => ({
      transactionId: doc.id,
      ...doc.data(),
    }));
  }

  async getTransactionsByStatus(status) {
    const snapshot = await db
      .collection('transactions')
      .where('status', '==', status)
      .get();
    
    return snapshot.docs.map(doc => ({
      transactionId: doc.id,
      ...doc.data(),
    }));
  }
}

export const transactionDao = new TransactionDao();

