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
      id: paymentId, // Alias for backward compatibility
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
      stripeSessionId: entity.stripeSessionId || null,
      checkoutUrl: entity.checkoutUrl || null,
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
  // Always required
  if (!data.userId) {
    const error = new Error('userId is required');
    error.status = 400;
    throw error;
  }
  if (!data.courseTitle) {
    const error = new Error('courseTitle is required');
    error.status = 400;
    throw error;
  }
  if (typeof data.amount !== 'number' || data.amount < 0) {
    const error = new Error('Amount must be a non-negative number');
    error.status = 400;
    throw error;
  }

  const paymentType = data.paymentType || (data.planId ? 'subscription' : 'course_purchase');

  // Course purchase: require courseId
  if (paymentType === 'course_purchase' && !data.courseId) {
    const error = new Error('courseId is required for course purchases');
    error.status = 400;
    throw error;
  }

  // Subscription: require planId
  if (paymentType === 'subscription' && !data.planId) {
    const error = new Error('planId is required for subscriptions');
    error.status = 400;
    throw error;
  }
},
};
