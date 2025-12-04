// src/modules/course/mapper/Course.mapper.js

/**
 * CourseMapper - Converts between CourseModel (API) and CourseEntity (Firestore)
 */
export const CourseMapper = {
  /**
   * Converts CourseCreateModel (from API) to CourseEntity (for Firestore)
   * 
   * @param {string} instructorId - Instructor's user ID
   * @param {string} instructorName - Instructor's display name
   * @param {import('../model/Course.model.js').CourseCreateModel} model - API data
   * @returns {import('../model/entity/Course.entity.js').CourseEntity}
   */
  toEntity(instructorId, instructorName, model) {
    const now = new Date();

    return {
      title: model.title,
      description: model.description,
      instructorId,
      instructorName,
      category: model.category,
      level: model.level,
      price: model.price,
      thumbnail: model.thumbnail || null,
      duration: model.duration,
      enrolledCount: 0,
      rating: 0,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Course.model.js').CourseUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Course.entity.js').CourseEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      updatedAt: new Date(),
    };

    if (model.title !== undefined) updates.title = model.title;
    if (model.description !== undefined) updates.description = model.description;
    if (model.category !== undefined) updates.category = model.category;
    if (model.level !== undefined) updates.level = model.level;
    if (model.price !== undefined) updates.price = model.price;
    if (model.thumbnail !== undefined) updates.thumbnail = model.thumbnail || null;
    if (model.duration !== undefined) updates.duration = model.duration;

    return updates;
  },

  /**
   * Converts CourseEntity (from Firestore) to CourseModel (for API response)
   * 
   * @param {string} courseId - Firestore document ID
   * @param {import('../model/entity/Course.entity.js').CourseEntity} entity - Firestore document data
   * @returns {import('../model/Course.model.js').CourseModel}
   */
  toModel(courseId, entity) {
    if (!entity) return null;

    return {
      courseId,
      title: entity.title,
      description: entity.description,
      instructorId: entity.instructorId,
      instructorName: entity.instructorName,
      category: entity.category,
      level: entity.level,
      price: entity.price,
      thumbnail: entity.thumbnail,
      duration: entity.duration,
      enrolledCount: entity.enrolledCount || 0,
      rating: entity.rating || 0,
      isSystemCourse: entity.isSystemCourse || false,
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
   * @returns {Array<import('../model/Course.model.js').CourseModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.courseId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Course.model.js').CourseCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    const requiredFields = ['title', 'description', 'category', 'level', 'price', 'duration'];
    
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        const error = new Error(`${field} is required`);
        error.status = 400;
        throw error;
      }
    }

    if (typeof data.price !== 'number' || data.price < 0) {
      const error = new Error('Price must be a non-negative number');
      error.status = 400;
      throw error;
    }

    if (typeof data.duration !== 'number' || data.duration <= 0) {
      const error = new Error('Duration must be a positive number (hours)');
      error.status = 400;
      throw error;
    }

    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(data.level)) {
      const error = new Error('Level must be one of: beginner, intermediate, advanced');
      error.status = 400;
      throw error;
    }
  },
};
