// src/modules/Transaction/model/entity/Transaction.entity.js
export class Transaction {
  constructor(
    transactionId,
    paymentId,
    userId,
    courseId,
    transactionType,
    amount,
    currency,
    status = 'pending',
    paymentGateway,
    gatewayTransactionId,
    description,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    this.transactionId = transactionId;
    this.paymentId = paymentId;
    this.userId = userId;
    this.courseId = courseId;
    this.transactionType = transactionType;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
    this.paymentGateway = paymentGateway;
    this.gatewayTransactionId = gatewayTransactionId;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
