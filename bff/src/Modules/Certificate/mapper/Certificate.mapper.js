// src/modules/certificate/mapper/Certificate.mapper.js

/**
 * CertificateMapper - Converts between CertificateModel (API) and CertificateEntity (Firestore)
 */
export const CertificateMapper = {
  /**
   * Converts CertificateCreateModel (from API) to CertificateEntity (for Firestore)
   * 
   * @param {string} courseId - Course ID
   * @param {import('../model/Certificate.model.js').CertificateCreateModel} model - API data
   * @returns {import('../model/entity/Certificate.entity.js').CertificateEntity}
   */
  toEntity(courseId, model) {
    const now = new Date();

    return {
      enrollmentId: model.enrollmentId,
      studentId: model.studentId,
      courseId,
      issuedAt: model.issuedAt || now,
      grade: model.grade ?? null,
      metadata: model.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Certificate.model.js').CertificateUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Certificate.entity.js').CertificateEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      updatedAt: new Date(),
    };

    if (model.grade !== undefined) updates.grade = model.grade;
    if (model.metadata !== undefined) updates.metadata = model.metadata;

    return updates;
  },

  /**
   * Converts CertificateEntity (from Firestore) to CertificateModel (for API response)
   * 
   * @param {string} certificateId - Firestore document ID
   * @param {import('../model/entity/Certificate.entity.js').CertificateEntity} entity - Firestore document data
   * @returns {import('../model/Certificate.model.js').CertificateModel}
   */
  toModel(certificateId, entity) {
    if (!entity) return null;

    const formatDate = (date) => {
      if (!date) return null;
      return date?.toDate?.() ? date.toDate().toISOString() : date;
    };

    return {
      certificateId,
      enrollmentId: entity.enrollmentId,
      studentId: entity.studentId,
      courseId: entity.courseId,
      issuedAt: formatDate(entity.issuedAt),
      grade: entity.grade,
      metadata: entity.metadata || {},
      createdAt: formatDate(entity.createdAt),
      updatedAt: formatDate(entity.updatedAt),
    };
  },

  /**
   * Converts array of entities to models
   * 
   * @param {Array<{id: string, ...entity}>} entities - Array of Firestore entities with IDs
   * @returns {Array<import('../model/Certificate.model.js').CertificateModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.certificateId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Certificate.model.js').CertificateCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.enrollmentId) {
      const error = new Error('Enrollment ID is required');
      error.status = 400;
      throw error;
    }

    if (!data.studentId) {
      const error = new Error('Student ID is required');
      error.status = 400;
      throw error;
    }
  },
};
