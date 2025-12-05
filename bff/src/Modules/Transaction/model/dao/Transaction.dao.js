// Transaction.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
// Follows DRY principle with reusable query methods

import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Transactions';

export class TransactionDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { transactionId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ transactionId: doc.id, ...doc.data() }));
  }

  async _queryByField(field, value) {
    const snapshot = await this.collection.where(field, '==', value).get();
    return this._snapshotToRaw(snapshot);
  }

  async create(data) {
    const docData = {
      payment_id: data.paymentId,
      user_id: data.userId,
      course_id: data.courseId,
      amount: data.amount,
      currency: data.currency || 'TND',
      status: data.status || 'pending',
      gateway: data.gateway || 'stripe',
      gateway_ref: data.gatewayRef || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const docRef = await this.collection.add(docData);
    return { transactionId: docRef.id, ...docData };
  }

  async getById(transactionId) {
    const doc = await this.collection.doc(transactionId).get();
    return this._docToRaw(doc);
  }

  async update(transactionId, updateData) {
    const docData = { ...updateData, updated_at: new Date() };
    await this.collection.doc(transactionId).update(docData);
    return this.getById(transactionId);
  }

  async getByPaymentId(paymentId) {
    return this._queryByField('payment_id', paymentId);
  }

  async getByUserId(userId) {
    return this._queryByField('user_id', userId);
  }

  async getByCourseId(courseId) {
    return this._queryByField('course_id', courseId);
  }

  async getByStatus(status) {
    return this._queryByField('status', status);
  }

  async delete(transactionId) {
    await this.collection.doc(transactionId).delete();
    return { success: true };
  }
}

export const transactionDao = new TransactionDao();