// src/modules/chapter/mapper/Chapter.mapper.js

/**
 * ChapterMapper - Converts between ChapterModel (API) and ChapterEntity (Firestore)
 */
export const ChapterMapper = {
  /**
   * Converts ChapterCreateModel (from API) to ChapterEntity (for Firestore)
   * 
   * @param {string} courseId - Parent course ID
   * @param {import('../model/Chapter.model.js').ChapterCreateModel} model - API data
   * @returns {import('../model/entity/Chapter.entity.js').ChapterEntity}
   */
  toEntity(courseId, model) {
    const now = new Date();

    return {
      courseId,
      title: model.title,
      order: model.order ?? 0,
      isPublished: model.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Chapter.model.js').ChapterUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Chapter.entity.js').ChapterEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      updatedAt: new Date(),
    };

    if (model.title !== undefined) updates.title = model.title;
    if (model.order !== undefined) updates.order = model.order;
    if (model.isPublished !== undefined) updates.isPublished = model.isPublished;

    return updates;
  },

  /**
   * Converts ChapterEntity (from Firestore) to ChapterModel (for API response)
   * 
   * @param {string} chapterId - Firestore document ID
   * @param {import('../model/entity/Chapter.entity.js').ChapterEntity} entity - Firestore document data
   * @returns {import('../model/Chapter.model.js').ChapterModel}
   */
  toModel(chapterId, entity) {
    if (!entity) return null;

    return {
      chapterId,
      courseId: entity.courseId,
      title: entity.title,
      order: entity.order ?? 0,
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
   * @returns {Array<import('../model/Chapter.model.js').ChapterModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.chapterId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Chapter.model.js').ChapterCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.title) {
      const error = new Error('Chapter title is required');
      error.status = 400;
      throw error;
    }

    if (data.order !== undefined && (typeof data.order !== 'number' || data.order < 0)) {
      const error = new Error('Order must be a non-negative number');
      error.status = 400;
      throw error;
    }
  },
};
