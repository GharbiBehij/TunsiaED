// src/modules/Enrollement/model/dao/Enrollement.dao.js
import { db } from '../../../../config/firebase.js';

export class EnrollmentDao {
  async createEnrollment(userId, data, paymentId, transactionId) {
    const enrollmentDoc = {
      userId,
      courseId: data.courseId,
      enrollmentDate: new Date(),
      status: 'active',
      paymentId: paymentId || null,
      transactionId: transactionId || null,
    };

    const docRef = await db.collection('enrollments').add(enrollmentDoc);
    
    return {
      enrollmentId: docRef.id,
      ...enrollmentDoc,
    };
  }

  async getEnrollmentById(enrollmentId) {
    const doc = await db.collection('enrollments').doc(enrollmentId).get();
    return doc.exists ? doc.data() : null;
  }

  async getUserEnrollments(userId) {
    const snapshot = await db
      .collection('enrollments')
      .where('userId', '==', userId)
      .get();
    
    return snapshot.docs.map(doc => ({
      enrollmentId: doc.id,
      ...doc.data(),
    }));
  }

  async getCourseEnrollments(courseId) {
    const snapshot = await db
      .collection('enrollments')
      .where('courseId', '==', courseId)
      .get();
    
    return snapshot.docs.map(doc => ({
      enrollmentId: doc.id,
      ...doc.data(),
    }));
  }

  async checkUserEnrollment(userId, courseId) {
    const snapshot = await db
      .collection('enrollments')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    
    return !snapshot.empty;
  }
}

export const enrollmentDao = new EnrollmentDao();

