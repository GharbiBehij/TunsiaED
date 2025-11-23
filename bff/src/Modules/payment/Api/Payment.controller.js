// bff/src/Modules/payment/Api/Payment.controller.js
import { paymentService } from '../service/Payment.service.js';

export class PaymentController {
  async createPayment(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const data = req.body;
      const result = await paymentService.createPayment(userId, data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPaymentById(req, res) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentById(paymentId);
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePayment(req, res) {
    try {
      const { paymentId } = req.params;
      const data = req.body;
      const transactionId = data.status === 'completed' ? req.body.transactionId : undefined;
      
      const result = await paymentService.updatePayment(paymentId, data, transactionId);
      
      if (!result) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserPayments(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const payments = await paymentService.getUserPayments(userId);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCoursePayments(req, res) {
    try {
      const { courseId } = req.params;
      const payments = await paymentService.getCoursePayments(courseId);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPaymentsByStatus(req, res) {
    try {
      const { status } = req.params;
      const payments = await paymentService.getPaymentsByStatus(status);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const paymentController = new PaymentController();

