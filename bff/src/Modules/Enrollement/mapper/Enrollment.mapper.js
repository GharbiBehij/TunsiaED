// src/modules/enrollment/mapper/Enrollment.mapper.js

/**
 * EnrollmentMapper - Converts between EnrollmentModel (API) and EnrollmentEntity (Firestore)
 */
export const EnrollmentMapper = {
  /**
   * Converts enrollment create data to EnrollmentEntity (for Firestore)
   * 
   * @param {string} userId - User ID
   * @param {import('../model/Enrollment.model.js').EnrollmentCreateModel} model - API data
   * @param {string|null} paymentId - Payment ID
   * @param {string|null} transactionId - Transaction ID
   * @returns {import('../model/entity/Enrollement.entity.js').EnrollmentEntity}
   */
  toEntity(userId, model, paymentId, transactionId) {
    return {
      userId,
      courseId: model.courseId,
      enrollmentDate: new Date(),
      status: 'active',
      paymentId: paymentId || null,
      transactionId: transactionId || null,
    };
  },

  /**
   * Converts progress update data from API to Firestore format
   * 
   * @param {import('../model/Enrollment.model.js').EnrollmentProgressUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Enrollement.entity.js').EnrollmentEntity>}
   */
  toEntityUpdate(model) {
    return {
      ...model,
      updatedAt: new Date(),
    };
  },

  /**
   * Converts EnrollmentEntity (from Firestore) to EnrollmentModel (for API response)
   * 
   * @param {string} enrollmentId - Firestore document ID
   * @param {import('../model/entity/Enrollement.entity.js').EnrollmentEntity} entity - Firestore document data
   * @returns {import('../model/Enrollment.model.js').EnrollmentModel}
   */
  toModel(enrollmentId, entity) {
    if (!entity) return null;

    const formatDate = (date) => {
      if (!date) return null;
      return date?.toDate?.() ? date.toDate().toISOString() : date;
    };

    return {
      enrollmentId,
      userId: entity.userId,
      courseId: entity.courseId,
      enrollmentDate: formatDate(entity.enrollmentDate),
      status: entity.status,
      paymentId: entity.paymentId,
      transactionId: entity.transactionId,
      progress: entity.progress || 0,
      completedLessons: entity.completedLessons || [],
      completed: entity.completed || false,
      updatedAt: formatDate(entity.updatedAt),
    };
  },

  /**
   * Converts EnrollmentEntity to a model with progress info (enriched view)
   * 
   * @param {string} enrollmentId - Firestore document ID
   * @param {import('../model/entity/Enrollement.entity.js').EnrollmentEntity} entity - Firestore document data
   * @returns {import('../model/Enrollment.model.js').EnrollmentModel}
   */
  toModelWithProgress(enrollmentId, entity) {
    if (!entity) return null;

    const formatDate = (date) => {
      if (!date) return null;
      return date?.toDate?.() ? date.toDate().toISOString() : date;
    };

    return {
      enrollmentId,
      userId: entity.userId,
      courseId: entity.courseId,
      progress: entity.progress || 0,
      completedLessons: entity.completedLessons || [],
      completed: entity.completed || false,
      enrolledAt: formatDate(entity.enrollmentDate),
      updatedAt: formatDate(entity.updatedAt),
    };
  },

  /**
   * Converts array of entities to models
   * 
   * @param {Array<{id: string, ...entity}>} entities - Array of Firestore entities with IDs
   * @returns {Array<import('../model/Enrollment.model.js').EnrollmentModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.enrollmentId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Enrollment.model.js').EnrollmentCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.courseId) {
      const error = new Error('Course ID is required');
      error.status = 400;
      throw error;
    }
  },
};
