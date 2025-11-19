// src/modules/payment/Model/entity/Payment.entity.js
export class Payment {
  constructor(
    paymentId,
    userId,
    courseId,
    amount,
    currency,
    paymentType,
    subscriptionType,
    paymentMethod = 'credit_card',
    status = 'pending',
    transactionId,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    this.paymentId = paymentId;
    this.userId = userId;
    this.courseId = courseId;
    this.amount = amount;
    this.currency = currency;
    this.paymentType = paymentType;
    this.subscriptionType = subscriptionType;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.transactionId = transactionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
