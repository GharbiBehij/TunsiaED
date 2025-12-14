// src/modules/quiz/mapper/Quiz.mapper.js

/**
 * QuizMapper - Converts between QuizModel (API) and QuizEntity (Firestore)
 */
export const QuizMapper = {
  /**
   * Converts QuizCreateModel (from API) to QuizEntity (for Firestore)
   * 
   * @param {string} courseId - Parent course ID
   * @param {string|null} lessonId - Parent lesson ID (optional)
   * @param {import('../model/Quiz.model.js').QuizCreateModel} model - API data
   * @returns {import('../model/entity/Quiz.entity.js').QuizEntity}
   */
  toEntity(courseId, lessonId, model) {
    const now = new Date();

    return {
      courseId,
      lessonId: lessonId ?? null,
      title: model.title,
      totalQuestions: model.totalQuestions ?? 0,
      passingScore: model.passingScore ?? 0,
      isPublished: model.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Quiz.model.js').QuizUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Quiz.entity.js').QuizEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      updatedAt: new Date(),
    };

    if (model.title !== undefined) updates.title = model.title;
    if (model.totalQuestions !== undefined) updates.totalQuestions = model.totalQuestions;
    if (model.passingScore !== undefined) updates.passingScore = model.passingScore;
    if (model.isPublished !== undefined) updates.isPublished = model.isPublished;

    return updates;
  },

  /**
   * Converts QuizEntity (from Firestore) to QuizModel (for API response)
   * 
   * @param {string} quizId - Firestore document ID
   * @param {import('../model/entity/Quiz.entity.js').QuizEntity} entity - Firestore document data
   * @returns {import('../model/Quiz.model.js').QuizModel}
   */
  toModel(quizId, entity) {
    if (!entity) return null;

    return {
      quizId,
      courseId: entity.courseId,
      lessonId: entity.lessonId ?? null,
      title: entity.title,
      totalQuestions: entity.totalQuestions ?? 0,
      passingScore: entity.passingScore ?? 0,
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
   * @returns {Array<import('../model/Quiz.model.js').QuizModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.quizId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Quiz.model.js').QuizCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.title) {
      const error = new Error('Quiz title is required');
      error.status = 400;
      throw error;
    }

    if (data.totalQuestions !== undefined && (typeof data.totalQuestions !== 'number' || data.totalQuestions < 0)) {
      const error = new Error('Total questions must be a non-negative number');
      error.status = 400;
      throw error;
    }

    if (data.passingScore !== undefined && (typeof data.passingScore !== 'number' || data.passingScore < 0)) {
      const error = new Error('Passing score must be a non-negative number');
      error.status = 400;
      throw error;
    }
  },
};
