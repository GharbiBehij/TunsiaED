// src/modules/Enrollement/repository/Enrollement.repository.js
import { enrollmentDao } from '../model/dao/Enrollement.dao.js';
import { Enrollment } from '../model/entity/Enrollement.entity.js';

export class EnrollmentRepository {
  async createEnrollment(userId, data, paymentId, transactionId) {
    const raw = await enrollmentDao.createEnrollment(
      userId,
      data,
      paymentId,
      transactionId
    );

    return new Enrollment(
      raw.enrollmentId,
      raw.userId,
      raw.courseId,
      new Date(raw.enrollmentDate),
      raw.status,
      raw.paymentId || undefined,
      raw.transactionId || undefined,
      raw
    );
  }

  async findByEnrollmentId(enrollmentId) {
    try {
      const doc = await enrollmentDao.getEnrollmentById(enrollmentId);
      if (!doc) return null;

      return new Enrollment(
        enrollmentId,
        doc.userId,
        doc.courseId,
        new Date(doc.enrollmentDate),
        doc.status,
        doc.paymentId,
        doc.transactionId,
        doc
      );
    } catch {
      return null;
    }
  }

  async findUserEnrollments(userId) {
    try {
      const docs = await enrollmentDao.getUserEnrollments(userId);
      return docs.map(
        (doc) =>
          new Enrollment(
            doc.enrollmentId,
            doc.userId,
            doc.courseId,
            new Date(doc.enrollmentDate),
            doc.status,
            doc.paymentId || undefined,
            doc.transactionId || undefined,
            doc
          )
      );
    } catch {
      return [];
    }
  }
  async getCourseEnrollments(courseId) {
    try {
      const docs = await enrollmentDao.getCourseEnrollments(courseId);
      return docs.map(doc => ({
        enrollmentId: doc.enrollmentId,
        userId: doc.userId,
        enrolledAt: doc.enrolledAt,
        progress: doc.progress
      }));
    } catch {
      return [];
    }
  }
  async checkUserEnrollment(userId, courseId) {
    try {
      return await enrollmentDao.checkUserEnrollment(userId, courseId);
    } catch {
      return false;
    }
  }
}

export const enrollmentRepository = new EnrollmentRepository();

