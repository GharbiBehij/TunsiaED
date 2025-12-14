// src/modules/Progress/mapper/Progress.mapper.js

/**
 * Helper: Convert Firestore Timestamp to ISO string
 */
function formatDate(date) {
  if (!date) return null;
  if (date?.toDate) return date.toDate().toISOString();
  if (date instanceof Date) return date.toISOString();
  return date;
}

/**
 * ProgressMapper - Converts between ProgressModel (API) and ProgressEntity (Firestore)
 */
export const ProgressMapper = {
  /**
   * Converts ProgressCreateModel (from API) to ProgressEntity (for Firestore)
   * 
   * @param {import('../model/Progress.model.js').ProgressCreateModel} model - API data
   * @returns {import('../model/entity/Progress.entity.js').ProgressEntity}
   */
  toEntity(model) {
    const now = new Date();

    return {
      enrollmentId: model.enrollmentId,
      moduleType: model.moduleType,
      moduleId: model.moduleId,
      userId: model.userId,
      progress: model.progress || 0,
      completedItems: model.completedItems || [],
      totalItems: model.totalItems || 0,
      completed: model.completed || false,
      startedAt: now,
      completedAt: null,
      lastAccessedAt: now,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Progress.model.js').ProgressUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Progress.entity.js').ProgressEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      lastAccessedAt: new Date(),
      updatedAt: new Date(),
    };

    if (model.progress !== undefined) updates.progress = model.progress;
    if (model.completedItems !== undefined) updates.completedItems = model.completedItems;
    if (model.totalItems !== undefined) updates.totalItems = model.totalItems;
    if (model.completed !== undefined) {
      updates.completed = model.completed;
      if (model.completed) {
        updates.completedAt = new Date();
      }
    }

    // Auto-complete if progress reaches 100
    if (model.progress >= 100 && !updates.completed) {
      updates.completed = true;
      updates.completedAt = new Date();
    }

    return updates;
  },

  /**
   * Converts ProgressEntity (from Firestore) to ProgressModel (for API response)
   * 
   * @param {string} progressId - Firestore document ID
   * @param {import('../model/entity/Progress.entity.js').ProgressEntity} entity - Firestore document data
   * @returns {import('../model/Progress.model.js').ProgressModel}
   */
  toModel(progressId, entity) {
    if (!entity) return null;

    return {
      progressId,
      enrollmentId: entity.enrollmentId,
      moduleType: entity.moduleType,
      moduleId: entity.moduleId,
      userId: entity.userId,
      progress: entity.progress ?? 0,
      completedItems: entity.completedItems || [],
      totalItems: entity.totalItems ?? 0,
      completed: entity.completed ?? false,
      startedAt: formatDate(entity.startedAt),
      completedAt: formatDate(entity.completedAt),
      lastAccessedAt: formatDate(entity.lastAccessedAt),
      createdAt: formatDate(entity.createdAt),
      updatedAt: formatDate(entity.updatedAt),
    };
  },

  /**
   * Converts array of entities to models
   * 
   * @param {Array<{id: string, ...entity}>} entities - Array of Firestore entities with IDs
   * @returns {Array<import('../model/Progress.model.js').ProgressModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.progressId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Progress.model.js').ProgressCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.enrollmentId) {
      const error = new Error('Enrollment ID is required');
      error.status = 400;
      throw error;
    }

    if (!data.moduleType) {
      const error = new Error('Module type is required');
      error.status = 400;
      throw error;
    }

    const validModuleTypes = ['course', 'chapter', 'lesson', 'quiz'];
    if (!validModuleTypes.includes(data.moduleType)) {
      const error = new Error('Module type must be one of: course, chapter, lesson, quiz');
      error.status = 400;
      throw error;
    }

    if (!data.moduleId) {
      const error = new Error('Module ID is required');
      error.status = 400;
      throw error;
    }

    if (!data.userId) {
      const error = new Error('User ID is required');
      error.status = 400;
      throw error;
    }
  },
};
