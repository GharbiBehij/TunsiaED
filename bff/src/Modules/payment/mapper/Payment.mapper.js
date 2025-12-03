// src/modules/payment/mapper/Payment.mapper.js
import '../model/Payment.model.js';
import '../model/entity/Payment.entity.js';

/**
 * PaymentMapper - Converts between PaymentModel (API) and PaymentEntity (Firestore)
 */
export const PaymentMapper = {
  /**
   * Converts PaymentCreateModel (from API) to PaymentEntity (for Firestore)
   * 
   * @param {import('../model/Payment.model.js').PaymentCreateModel} model - API data
   * @returns {import('../model/entity/Payment.entity.js').PaymentEntity}
   */
  toEntity(model) {
    const now = new Date();

    return {
      userId: model.userId,
      courseId: model.courseId,
      courseTitle: model.courseTitle,
      amount: model.amount,
      currency: model.currency || 'TND',
      paymentType: model.paymentType || 'course_purchase',
      subscriptionType: model.subscriptionType || null,
      paymentMethod: model.paymentMethod || null,
      status: 'pending',
      transactionId: null,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/Payment.model.js').PaymentUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/Payment.entity.js').PaymentEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      ...model,
      updatedAt: new Date(),
    };

    return updates;
  },

  /**
   * Converts PaymentEntity (from Firestore) to PaymentModel (for API response)
   * 
   * @param {string} paymentId - Firestore document ID
   * @param {import('../model/entity/Payment.entity.js').PaymentEntity} entity - Firestore document data
   * @returns {import('../model/Payment.model.js').PaymentModel}
   */
  toModel(paymentId, entity) {
    if (!entity) return null;

    return {
      paymentId,
      userId: entity.userId,
      courseId: entity.courseId,
      courseTitle: entity.courseTitle,
      amount: entity.amount,
      currency: entity.currency || 'TND',
      paymentType: entity.paymentType || 'course_purchase',
      subscriptionType: entity.subscriptionType,
      paymentMethod: entity.paymentMethod,
      status: entity.status,
      transactionId: entity.transactionId,
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
   * @returns {Array<import('../model/Payment.model.js').PaymentModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.paymentId || entity.id, entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/Payment.model.js').PaymentCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    const requiredFields = ['userId', 'courseId', 'courseTitle', 'amount'];
    
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        const error = new Error(`${field} is required`);
        error.status = 400;
        throw error;
      }
    }

    if (typeof data.amount !== 'number' || data.amount < 0) {
      const error = new Error('Amount must be a non-negative number');
      error.status = 400;
      throw error;
    }
  },
};
