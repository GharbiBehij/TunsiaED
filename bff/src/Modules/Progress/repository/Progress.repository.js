// Progress Repository layer - returns raw Firestore data, Service handles mapping
import { progressDao } from '../model/dao/Progress.dao.js';

export class ProgressRepository {
  /**
   * Create a new progress record
   * @returns {Promise<Object>} Raw progress data
   */
  async createProgress(progressData) {
    try {
      return await progressDao.createProgress(progressData);
    } catch (error) {
      throw new Error('Failed to create progress: ' + error.message);
    }
  }

  /**
   * Get progress by ID
   * @returns {Promise<Object|null>} Raw progress data or null
   */
  async getProgressById(progressId) {
    try {
      return await progressDao.getProgressById(progressId);
    } catch {
      return null;
    }
  }

  /**
   * Get or create progress for enrollment and module
   * @returns {Promise<Object>} Raw progress data
   */
  async getOrCreateProgress(enrollmentId, moduleType, moduleId, userId, totalItems = 0) {
    try {
      let doc = await progressDao.getProgressByEnrollmentAndModule(enrollmentId, moduleType, moduleId);
      
      if (!doc) {
        // Create new progress record
        doc = await progressDao.createProgress({
          enrollmentId,
          moduleType,
          moduleId,
          userId,
          totalItems,
          progress: 0,
          completedItems: [],
          completed: false,
        });
      }

      return doc;
    } catch (error) {
      throw new Error('Failed to get or create progress: ' + error.message);
    }
  }

  /**
   * Get all progress records for an enrollment
   * @returns {Promise<Object[]>} Array of raw progress data
   */
  async getProgressByEnrollment(enrollmentId) {
    try {
      return await progressDao.getProgressByEnrollment(enrollmentId);
    } catch {
      return [];
    }
  }

  /**
   * Get all progress records for a user
   * @returns {Promise<Object[]>} Array of raw progress data
   */
  async getProgressByUser(userId) {
    try {
      return await progressDao.getProgressByUser(userId);
    } catch {
      return [];
    }
  }

  /**
   * Get progress for a specific module
   * @returns {Promise<Object[]>} Array of raw progress data
   */
  async getProgressByModule(moduleType, moduleId) {
    try {
      return await progressDao.getProgressByModule(moduleType, moduleId);
    } catch {
      return [];
    }
  }

  /**
   * Update progress
   * @returns {Promise<Object>} Raw updated progress data
   */
  async updateProgress(progressId, updateData) {
    try {
      return await progressDao.updateProgress(progressId, updateData);
    } catch (error) {
      throw new Error('Failed to update progress: ' + error.message);
    }
  }

  /**
   * Mark item as completed
   * @returns {Promise<Object>} Raw updated progress data
   */
  async markItemCompleted(progressId, itemId) {
    try {
      return await progressDao.markItemCompleted(progressId, itemId);
    } catch (error) {
      throw new Error('Failed to mark item completed: ' + error.message);
    }
  }

  /**
   * Get user's progress summary for a course
   * @returns {Promise<Object|null>} Raw progress data or null
   */
  async getUserCourseProgressSummary(userId, courseId) {
    try {
      return await progressDao.getUserCourseProgressSummary(userId, courseId);
    } catch {
      return null;
    }
  }

  /**
   * Get progress for instructor's courses
   * @returns {Promise<Object[]>} Array of raw progress data
   */
  async getInstructorCoursesProgress(courseIds) {
    try {
      return await progressDao.getInstructorCoursesProgress(courseIds);
    } catch {
      return [];
    }
  }

  /**
   * Delete progress
   * @returns {Promise<boolean>} Success status
   */
  async deleteProgress(progressId) {
    try {
      return await progressDao.deleteProgress(progressId);
    } catch (error) {
      throw new Error('Failed to delete progress: ' + error.message);
    }
  }

  /**
   * Delete all progress for an enrollment
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteProgressByEnrollment(enrollmentId) {
    try {
      return await progressDao.deleteProgressByEnrollment(enrollmentId);
    } catch (error) {
      throw new Error('Failed to delete enrollment progress: ' + error.message);
    }
  }
}

export const progressRepository = new ProgressRepository();
