// src/modules/payment/service/Payment.service.js
import { paymentRepository } from '../repository/Payment.repository.js';
import { PaymentMapper } from '../mapper/Payment.mapper.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';

export class PaymentService {
  async createPayment(userId, data) {
    // Validate course exists
    const course = await courseRepository.findByCourseId(data.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Validate payment type and subscription type
    if (data.paymentType === 'subscription' && !data.subscriptionType) {
      throw new Error('Subscription type is required for subscription payments');
    }

    // Calculate amount based on payment type
    let amount = data.amount;
    if (data.paymentType === 'subscription' && data.subscriptionType) {
      // For subscription, calculate based on subscription type
      // Monthly: course price * 1
      // Yearly: course price * 10 (discounted)
      amount = data.subscriptionType === 'monthly' 
        ? course.price 
        : course.price * 10;
    } else {
      // Individual payment uses course price
      amount = course.price;
    }

    const paymentData = {
      ...data,
      amount,
    };

    const payment = await paymentRepository.createPayment(userId, paymentData);

    return PaymentMapper.toResponse(payment, 'Payment created successfully');
  }

  async getPaymentById(paymentId) {
    const payment = await paymentRepository.findByPaymentId(paymentId);
    if (!payment) return null;

    return PaymentMapper.toResponse(payment, 'Payment retrieved successfully');
  }

  async updatePayment(paymentId, data, transactionId) {
    const updatedPayment = await paymentRepository.updatePayment(
      paymentId,
      data,
      transactionId
    );
    if (!updatedPayment) return null;

    return PaymentMapper.toResponse(updatedPayment, 'Payment updated successfully');
  }

  async getUserPayments(userId) {
    const payments = await paymentRepository.findPaymentsByUser(userId);
    return payments.map((payment) =>
      PaymentMapper.toResponse(payment, 'Payments retrieved successfully')
    );
  }

  async getCoursePayments(courseId) {
    const payments = await paymentRepository.findPaymentsByCourse(courseId);
    return payments.map((payment) =>
      PaymentMapper.toResponse(payment, 'Payments retrieved successfully')
    );
  }

  async getPaymentsByStatus(status) {
    const payments = await paymentRepository.findPaymentsByStatus(status);
    return payments.map((payment) =>
      PaymentMapper.toResponse(payment, 'Payments retrieved successfully')
    );
  }
}

export const paymentService = new PaymentService();

