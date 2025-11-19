// src/modules/Transaction/mapper/Transaction.mapper.js
import { Transaction } from '../model/entity/Transaction.entity.js';

export class TransactionMapper {
  static toResponse(entity, message) {
    return {
      transaction: {
        transactionId: entity.transactionId,
        paymentId: entity.paymentId,
        userId: entity.userId,
        courseId: entity.courseId,
        transactionType: entity.transactionType,
        amount: entity.amount,
        currency: entity.currency,
        status: entity.status,
        paymentGateway: entity.paymentGateway,
        gatewayTransactionId: entity.gatewayTransactionId,
        description: entity.description,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      },
      message,
    };
  }

  static toEntity(data) {
    return new Transaction(
      data.transactionId,
      data.paymentId,
      data.userId,
      data.courseId,
      data.transactionType,
      data.amount,
      data.currency,
      data.status,
      data.paymentGateway,
      data.gatewayTransactionId,
      data.description,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
}

