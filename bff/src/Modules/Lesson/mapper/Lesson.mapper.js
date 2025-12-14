// src/modules/lesson/mapper/Lesson.mapper.js

/**
 * LessonMapper - Converts between LessonModel (API) and LessonEntity (Firestore)
 */
export const LessonMapper = {
  /**
   * Converts LessonCreateModel (from API) to LessonEntity (for Firestore)
   * 
   * @param {string} courseId - Parent course ID
   * @param {string} chapterId - Parent chapter ID
   * @param {import('../model/Lesson.model.js').LessonCreateModel} model - API data
   * @returns {import('../model/entity/Lesson.entity.js').LessonEntity}
   */
  toEntity(courseId, chapterId, model) {
    const now = new Date();

    return {
      courseId,
      chapterId,
      title: model.title,
      order: model.order ?? 0,
      durationMinutes: model.durationMinutes ?? null,
      isPublished: model.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Lesson.model.js').LessonUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Lesson.entity.js').LessonEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      updatedAt: new Date(),
    };

    if (model.title !== undefined) updates.title = model.title;
    if (model.order !== undefined) updates.order = model.order;
    if (model.durationMinutes !== undefined) updates.durationMinutes = model.durationMinutes;
    if (model.isPublished !== undefined) updates.isPublished = model.isPublished;

    return updates;
  },

  /**
   * Converts LessonEntity (from Firestore) to LessonModel (for API response)
   * 
   * @param {string} lessonId - Firestore document ID
   * @param {import('../model/entity/Lesson.entity.js').LessonEntity} entity - Firestore document data
   * @returns {import('../model/Lesson.model.js').LessonModel}
   */
  toModel(lessonId, entity) {
    if (!entity) return null;

    return {
      lessonId,
      courseId: entity.courseId,
      chapterId: entity.chapterId,
      title: entity.title,
      order: entity.order ?? 0,
      durationMinutes: entity.durationMinutes ?? null,
      isPublished: entity.isPublished ?? false,
      createdAt: entity.createdAt?.toDate?.() 
        ? entity.createdAt.toDate().toISOString() 
        : entity.createdAt,
      updatedAt: entity.updatedAt?.toDate?.() 
        ? entity.updatedAt.toDate().toISOString() 
        : entity.updatedAt,
    };
  },

  /**
   * Converts array of entities to models
   * 
   * @param {Array<{id: string, ...entity}>} entities - Array of Firestore entities with IDs
   * @returns {Array<import('../model/Lesson.model.js').LessonModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.lessonId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Lesson.model.js').LessonCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.title) {
      const error = new Error('Lesson title is required');
      error.status = 400;
      throw error;
    }

    if (data.order !== undefined && (typeof data.order !== 'number' || data.order < 0)) {
      const error = new Error('Order must be a non-negative number');
      error.status = 400;
      throw error;
    }

    if (data.durationMinutes !== undefined && (typeof data.durationMinutes !== 'number' || data.durationMinutes < 0)) {
      const error = new Error('Duration must be a non-negative number');
      error.status = 400;
      throw error;
    }
  },
};
