// src/modules/Enrollement/repository/Enrollement.repository.js
import { enrollmentDao } from '../model/dao/Enrollement.dao.js';

export class EnrollmentRepository {
  async createEnrollment(userId, data, paymentId, transactionId) {
    return await enrollmentDao.createEnrollment(
      userId,
      data,
      paymentId,
      transactionId
    );
  }

  async findByEnrollmentId(enrollmentId) {
    try {
      const doc = await enrollmentDao.getEnrollmentById(enrollmentId);
      return doc || null;
    } catch {
      return null;
    }
  }

  async findUserEnrollments(userId) {
    try {
      const docs = await enrollmentDao.getUserEnrollments(userId);
      return docs;
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

  /**
   * Update enrollment progress
   * @param {string} enrollmentId - The enrollment ID
   * @param {Object} progressData - Progress data
   */
  async updateEnrollmentProgress(enrollmentId, progressData) {
    try {
      return await enrollmentDao.updateEnrollmentProgress(enrollmentId, progressData);
    } catch (error) {
      throw new Error('Failed to update enrollment progress: ' + error.message);
    }
  }

  /**
   * Get enrollment with detailed progress
   * @param {string} enrollmentId - The enrollment ID
   */
  async getEnrollmentWithProgress(enrollmentId) {
    try {
      return await enrollmentDao.getEnrollmentWithProgress(enrollmentId);
    } catch {
      return null;
    }
  }

  /**
   * Get all enrollments for a course with progress (for instructors)
   * @param {string} courseId - The course ID
   */
  async getCourseEnrollmentsWithProgress(courseId) {
    try {
      return await enrollmentDao.getCourseEnrollmentsWithProgress(courseId);
    } catch {
      return [];
    }
  }
}

export const enrollmentRepository = new EnrollmentRepository();

