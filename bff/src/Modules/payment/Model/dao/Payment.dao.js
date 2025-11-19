// src/modules/payment/Model/dao/Payment.dao.js
import { db } from '../../../../config/firebase.js';

export class PaymentDao {
  async createPayment(userId, data) {
    const paymentDoc = {
      userId,
      courseId: data.courseId,
      amount: data.amount,
      currency: data.currency || 'USD',
      paymentType: data.paymentType,
      subscriptionType: data.subscriptionType || null,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      transactionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('payments').add(paymentDoc);
    
    return {
      paymentId: docRef.id,
      ...paymentDoc,
    };
  }

  async getPaymentById(paymentId) {
    const doc = await db.collection('payments').doc(paymentId).get();
    return doc.exists ? doc.data() : null;
  }

  async updatePayment(paymentId, data, transactionId) {
    const updateData = {
      updatedAt: new Date(),
    };

    if (data.status !== undefined) updateData.status = data.status;
    if (transactionId !== undefined) updateData.transactionId = transactionId || null;

    await db.collection('payments').doc(paymentId).update(updateData);
    
    const updatedDoc = await db.collection('payments').doc(paymentId).get();
    return updatedDoc.exists ? updatedDoc.data() : null;
  }

  async getPaymentsByUser(userId) {
    const snapshot = await db
      .collection('payments')
      .where('userId', '==', userId)
      .get();
    
    return snapshot.docs.map(doc => ({
      paymentId: doc.id,
      ...doc.data(),
    }));
  }

  async getPaymentsByCourse(courseId) {
    const snapshot = await db
      .collection('payments')
      .where('courseId', '==', courseId)
      .get();
    
    return snapshot.docs.map(doc => ({
      paymentId: doc.id,
      ...doc.data(),
    }));
  }

  async getPaymentsByStatus(status) {
    const snapshot = await db
      .collection('payments')
      .where('status', '==', status)
      .get();
    
    return snapshot.docs.map(doc => ({
      paymentId: doc.id,
      ...doc.data(),
    }));
  }
}

export const paymentDao = new PaymentDao();

