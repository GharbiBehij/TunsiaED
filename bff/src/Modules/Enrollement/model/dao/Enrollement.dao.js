// src/modules/Enrollement/model/dao/Enrollement.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Enrollments';

export class EnrollmentDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { enrollmentId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ enrollmentId: doc.id, ...doc.data() }));
  }

  async createEnrollment(userId, data, paymentId, transactionId) {
    const enrollmentDoc = {
      userId,
      courseId: data.courseId,
      enrollmentDate: new Date(),
      status: 'active',
      paymentId: paymentId || null,
      transactionId: transactionId || null,
    };

    const docRef = await this.collection.add(enrollmentDoc);
    return { enrollmentId: docRef.id, ...enrollmentDoc };
  }

  async getEnrollmentById(enrollmentId) {
    const doc = await this.collection.doc(enrollmentId).get();
    return this._docToRaw(doc);
  }

  async getUserEnrollments(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getCourseEnrollments(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async checkUserEnrollment(userId, courseId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    return !snapshot.empty;
  }

  async updateEnrollmentProgress(enrollmentId, progressData) {
    const updateData = { ...progressData, updatedAt: new Date() };
    await this.collection.doc(enrollmentId).update(updateData);
    return this.getEnrollmentById(enrollmentId);
  }

  async getEnrollmentWithProgress(enrollmentId) {
    const doc = await this.collection.doc(enrollmentId).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
      enrollmentId: doc.id,
      ...data,
      progress: data.progress || 0,
      completedLessons: data.completedLessons || [],
      completed: data.completed || false,
    };
  }

  async getCourseEnrollmentsWithProgress(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .where('status', '==', 'active')
      .get();

    return snapshot.docs.map(doc => ({
      enrollmentId: doc.id,
      userId: doc.data().userId,
      courseId: doc.data().courseId,
      progress: doc.data().progress || 0,
      completedLessons: doc.data().completedLessons || [],
      completed: doc.data().completed || false,
      enrolledAt: doc.data().enrollmentDate,
      updatedAt: doc.data().updatedAt,
    }));
  }
}

export const enrollmentDao = new EnrollmentDao();