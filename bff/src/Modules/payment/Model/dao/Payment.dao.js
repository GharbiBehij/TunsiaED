// src/modules/payment/Model/dao/Payment.dao.js
import { db } from '../../../../config/firebase.js';

export class PaymentDao {
  async createPayment(data) {
    const paymentDoc = {
      userId: data.userId,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      amount: data.amount,
      currency: data.currency || 'TND',
      paymentType: data.paymentType || 'course_purchase',
      subscriptionType: data.subscriptionType || null,
      paymentMethod: data.paymentMethod || null,
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
    if (!doc.exists) return null;
    return { paymentId: doc.id, ...doc.data() };
  }

  async updatePayment(paymentId, updateData) {
    const finalUpdate = { ...updateData, updatedAt: new Date() };
    await db.collection('payments').doc(paymentId).update(finalUpdate);
    
    const doc = await db.collection('payments').doc(paymentId).get();
    return doc.exists ? { paymentId: doc.id, ...doc.data() } : null;
  }

  async getPaymentsByUser(userId) {
    const snapshot = await db.collection('payments')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ paymentId: doc.id, ...doc.data() }));
  }

  async getPaymentsByCourse(courseId) {
    const snapshot = await db.collection('payments')
      .where('courseId', '==', courseId)
      .get();
    
    return snapshot.docs.map(doc => ({ paymentId: doc.id, ...doc.data() }));
  }

  async getPaymentsByStatus(status) {
    const snapshot = await db.collection('payments')
      .where('status', '==', status)
      .get();
    
    return snapshot.docs.map(doc => ({ paymentId: doc.id, ...doc.data() }));
  }
}

export const paymentDao = new PaymentDao();