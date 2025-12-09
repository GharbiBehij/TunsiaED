// src/modules/payment/mapper/Payment.mapper.js

/**
 * PaymentMapper - Converts between PaymentModel (API) and PaymentEntity (Firestore)
 */
export const PaymentMapper = {
  /**
   * Converts PaymentCreateModel (from API) to PaymentEntity (for Firestore)
   * 
   */
  toEntity(model) {
    const now = new Date();

    return {
      userId: model.userId,
      courseId: model.courseId,
      courseTitle: model.courseTitle,
      amount: model.amount,
      originalAmount: model.originalAmount || null,
      promoCode: model.promoCode || null,
      promoDiscount: model.promoDiscount || null,
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

  toEntityUpdate(model) {
    const updates = {
      ...model,
      updatedAt: new Date(),
    };

    return updates;
  },

  toModel(paymentId, entity) {
    if (!entity) return null;

    return {
      paymentId,
      userId: entity.userId,
      courseId: entity.courseId,
      courseTitle: entity.courseTitle,
      amount: entity.amount,
      originalAmount: entity.originalAmount || null,
      promoCode: entity.promoCode || null,
      promoDiscount: entity.promoDiscount || null,
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
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity.paymentId || entity.id, entity)).filter(Boolean);
  },

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
