// src/modules/payment/model/dao/Payment.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'payments';

export class PaymentDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { paymentId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ paymentId: doc.id, ...doc.data() }));
  }

  async createPayment(data) {
    const paymentDoc = {
      userId: data.userId,
      courseId: data.courseId || null,
      planId: data.planId || null,
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

    const docRef = await this.collection.add(paymentDoc);
    return { paymentId: docRef.id, ...paymentDoc };
  }

  async getPaymentById(paymentId) {
    const doc = await this.collection.doc(paymentId).get();
    return this._docToRaw(doc);
  }

  async updatePayment(paymentId, updateData) {
    const finalUpdate = { ...updateData, updatedAt: new Date() };
    await this.collection.doc(paymentId).update(finalUpdate);
    return this.getPaymentById(paymentId);
  }

  async getPaymentsByUser(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getPaymentsByCourse(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getPaymentsByStatus(status) {
    const snapshot = await this.collection
      .where('status', '==', status)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async findByStripeSessionId(sessionId) {
    const snapshot = await this.collection
      .where('stripeSessionId', '==', sessionId)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return this._docToRaw(snapshot.docs[0]);
  }
}

export const paymentDao = new PaymentDao();