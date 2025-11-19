// src/modules/payment/mapper/Payment.mapper.js
import { Payment } from '../Model/entity/Payment.entity.js';

export class PaymentMapper {
  static toResponse(entity, message) {
    return {
      payment: {
        paymentId: entity.paymentId,
        userId: entity.userId,
        courseId: entity.courseId,
        amount: entity.amount,
        currency: entity.currency,
        paymentType: entity.paymentType,
        subscriptionType: entity.subscriptionType,
        paymentMethod: entity.paymentMethod,
        status: entity.status,
        transactionId: entity.transactionId,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      },
      message,
    };
  }

  static toEntity(data) {
    return new Payment(
      data.paymentId,
      data.userId,
      data.courseId,
      data.amount,
      data.currency,
      data.paymentType,
      data.subscriptionType,
      data.paymentMethod,
      data.status,
      data.transactionId,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
}

