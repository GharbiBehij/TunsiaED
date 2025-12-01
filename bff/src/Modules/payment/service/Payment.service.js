// src/modules/payment/service/Payment.service.js
import { paymentRepository } from '../repository/Payment.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { PaymentPermission } from './PaymentPermission.js';

export class PaymentService {
  async createPayment(userId, data) {
    const course = await courseRepository.findByCourseId(data.courseId);
    if (!course) throw new Error('Course not found');

    let amount = course.price;
    if (data.paymentType === 'subscription' && data.subscriptionType) {
      amount = data.subscriptionType === 'monthly' 
        ? course.price 
        : course.price * 10;
    }

    const paymentData = {
      userId,
      courseId: data.courseId,
      courseTitle: course.title,
      amount,
      currency: 'TND',
      paymentType: data.paymentType || 'course_purchase',
      subscriptionType: data.subscriptionType || null,
      paymentMethod: data.paymentMethod || null,
    };

    return await paymentRepository.createPayment(paymentData);
  }

  async getPaymentById(paymentId) {
    return await paymentRepository.findByPaymentId(paymentId);
  }

  async updatePayment(paymentId, user, updateData) {
    if (!PaymentPermission.update(user)) {
      throw new Error('Unauthorized');
    }
    return await paymentRepository.updatePayment(paymentId, updateData);
  }

  async getUserPayments(userId) {
    return await paymentRepository.findPaymentsByUser(userId);
  }

  async getCoursePayments(courseId) {
    return await paymentRepository.findPaymentsByCourse(courseId);
  }

  async getPaymentsByStatus(status) {
    return await paymentRepository.findPaymentsByStatus(status);
  }

  // Paymee webhook calls this
  async confirmPayment(paymentId, transactionId) {
    return await this.updatePayment(paymentId, { isAdmin: true }, {
      status: 'completed',
      transactionId,
    });
  }
}

export const paymentService = new PaymentService();