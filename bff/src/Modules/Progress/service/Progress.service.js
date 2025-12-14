// Progress Service layer - applies ProgressMapper to convert raw data
import { progressRepository } from '../repository/Progress.repository.js';
import { ProgressPermission } from './ProgressPermission.js';
import { ProgressMapper } from '../mapper/Progress.mapper.js';

export class ProgressService {
  /**
   * Convert raw progress data to model
   * @param {Object} raw - Raw Firestore data
   * @returns {import('../model/Progress.model.js').ProgressModel|null}
   */
  _toModel(raw) {
    if (!raw) return null;
    return ProgressMapper.toModel(raw.progressId, raw);
  }

  /**
   * Convert array of raw progress data to models
   * @param {Object[]} rawList - Array of raw Firestore data
   * @returns {import('../model/Progress.model.js').ProgressModel[]}
   */
  _toModels(rawList) {
    return rawList.map(raw => ProgressMapper.toModel(raw.progressId, raw));
  }

  /**
   * Convert model to entity (for creating)
   * @param {Object} model - Progress model data
   * @returns {import('../model/entity/Progress.entity.js').ProgressEntity}
   */
  _toEntity(model) {
    return ProgressMapper.toEntity(model);
  }

  /**
   * Convert model to entity update (for updating)
   * @param {Object} model - Progress update data
   * @returns {Partial<import('../model/entity/Progress.entity.js').ProgressEntity>}
   */
  _toEntityUpdate(model) {
    return ProgressMapper.toEntityUpdate(model);
  }

  /**
   * Create or get progress for a module
   * @param {Object} user - Authenticated user
   * @param {Object} data - Progress data
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel>}
   */
  async getOrCreateProgress(user, data) {
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    const { enrollmentId, moduleType, moduleId, totalItems } = data;
    
    const raw = await progressRepository.getOrCreateProgress(
      enrollmentId,
      moduleType,
      moduleId,
      user.uid,
      totalItems || 0
    );
    return this._toModel(raw);
  }

  /**
   * Get progress by ID
   * @param {Object} user - Authenticated user
   * @param {string} progressId - The progress ID
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel>}
   */
  async getProgressById(user, progressId) {
    const raw = await progressRepository.getProgressById(progressId);
    if (!raw) {
      throw new Error('Progress not found');
    }

    const progress = this._toModel(raw);

    if (!ProgressPermission.canViewProgress(user, raw)) {
      throw new Error('Unauthorized');
    }

    return progress;
  }

  /**
   * Get all progress for an enrollment (student view)
   * @param {Object} user - Authenticated user
   * @param {string} enrollmentId - The enrollment ID
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel[]>}
   */
  async getProgressByEnrollment(user, enrollmentId) {
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    const rawList = await progressRepository.getProgressByEnrollment(enrollmentId);
    
    // Students can only see their own progress
    if (!user.role || user.role === 'student') {
      const filtered = rawList.filter(p => p.userId === user.uid);
      return this._toModels(filtered);
    }

    return this._toModels(rawList);
  }

  /**
   * Get all progress for a user
   * @param {Object} user - Authenticated user
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel[]>}
   */
  async getProgressByUser(user) {
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    const rawList = await progressRepository.getProgressByUser(user.uid);
    return this._toModels(rawList);
  }

  /**
   * Get progress for a specific module (instructor view)
   * @param {Object} user - Authenticated user
   * @param {string} moduleType - The module type
   * @param {string} moduleId - The module ID
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel[]>}
   */
  async getProgressByModule(user, moduleType, moduleId) {
    if (!ProgressPermission.viewStudentProgress(user)) {
      throw new Error('Unauthorized');
    }

    // Additional ownership check should be done in instructor service
    const rawList = await progressRepository.getProgressByModule(moduleType, moduleId);
    return this._toModels(rawList);
  }

  /**
   * Update progress
   * @param {Object} user - Authenticated user
   * @param {string} progressId - The progress ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel>}
   */
  async updateProgress(user, progressId, updateData) {
    const raw = await progressRepository.getProgressById(progressId);
    if (!raw) {
      throw new Error('Progress not found');
    }

    if (!ProgressPermission.canUpdateProgress(user, raw)) {
      throw new Error('Unauthorized');
    }

    const updated = await progressRepository.updateProgress(progressId, updateData);
    return this._toModel(updated);
  }

  /**
   * Mark an item as completed
   * @param {Object} user - Authenticated user
   * @param {string} progressId - The progress ID
   * @param {string} itemId - The item ID to mark as completed
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel>}
   */
  async markItemCompleted(user, progressId, itemId) {
    const raw = await progressRepository.getProgressById(progressId);
    if (!raw) {
      throw new Error('Progress not found');
    }

    if (!ProgressPermission.canUpdateProgress(user, raw)) {
      throw new Error('Unauthorized');
    }

    const updated = await progressRepository.markItemCompleted(progressId, itemId);
    return this._toModel(updated);
  }

  /**
   * Get user's course progress summary
   * @param {Object} user - Authenticated user
   * @param {string} courseId - The course ID
   * @returns {Promise<import('../model/Progress.model.js').ProgressModel|null>}
   */
  async getUserCourseProgressSummary(user, courseId) {
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    const raw = await progressRepository.getUserCourseProgressSummary(user.uid, courseId);
    return this._toModel(raw);
  }

  /**
   * Delete progress (admin only)
   * @param {Object} user - Authenticated user
   * @param {string} progressId - The progress ID
   * @returns {Promise<boolean>}
   */
  async deleteProgress(user, progressId) {
    if (!ProgressPermission.deleteProgress(user)) {
      throw new Error('Unauthorized');
    }

    return await progressRepository.deleteProgress(progressId);
  }

  /**
   * Delete all progress for an enrollment (admin only)
   * @param {Object} user - Authenticated user
   * @param {string} enrollmentId - The enrollment ID
   * @returns {Promise<number>}
   */
  async deleteProgressByEnrollment(user, enrollmentId) {
    if (!ProgressPermission.deleteProgress(user)) {
      throw new Error('Unauthorized');
    }

    return await progressRepository.deleteProgressByEnrollment(enrollmentId);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get or create progress (internal - bypasses permission for orchestrator)
   * @param {string} enrollmentId
   * @param {string} moduleType
   * @param {string} moduleId
   * @param {string} userId
   * @param {number} totalItems
   */
  async getOrCreateProgressInternal(enrollmentId, moduleType, moduleId, userId, totalItems = 0) {
    const raw = await progressRepository.getOrCreateProgress(
      enrollmentId,
      moduleType,
      moduleId,
      userId,
      totalItems
    );
    return this._toModel(raw);
  }

  /**
   * Create progress (internal - bypasses permission for orchestrator)
   * @param {Object} progressData
   */
  async createProgressInternal(progressData) {
    const raw = await progressRepository.createProgress(progressData);
    return this._toModel(raw);
  }

  /**
   * Update progress (internal - bypasses permission for orchestrator)
   * @param {string} progressId
   * @param {Object} updateData
   */
  async updateProgressInternal(progressId, updateData) {
    const raw = await progressRepository.updateProgress(progressId, updateData);
    return this._toModel(raw);
  }

  /**
   * Mark item completed (internal - bypasses permission for orchestrator)
   * @param {string} progressId
   * @param {string} itemId
   */
  async markItemCompletedInternal(progressId, itemId) {
    const raw = await progressRepository.markItemCompleted(progressId, itemId);
    return this._toModel(raw);
  }

  /**
   * Get progress by enrollment (internal - bypasses permission for orchestrator)
   * @param {string} enrollmentId
   */
  async getProgressByEnrollmentInternal(enrollmentId) {
    const rawList = await progressRepository.getProgressByEnrollment(enrollmentId);
    return this._toModels(rawList);
  }

  /**
   * Get progress by module (internal - bypasses permission for orchestrator)
   * @param {string} moduleType
   * @param {string} moduleId
   */
  async getProgressByModuleInternal(moduleType, moduleId) {
    const rawList = await progressRepository.getProgressByModule(moduleType, moduleId);
    return this._toModels(rawList);
  }

  /**
   * Get progress by user (internal - bypasses permission for orchestrator)
   * @param {string} userId
   */
  async getProgressByUserInternal(userId) {
    const rawList = await progressRepository.getProgressByUser(userId);
    return this._toModels(rawList);
  }
}

export const progressService = new ProgressService();
