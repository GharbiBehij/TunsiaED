// src/modules/payment/Api/Payment.routes.js
import { Router } from 'express';
import { paymentController } from './Payment.controller.js';
import { validateBody } from '../../../middlewares/validation.middleware.js';
import { CreatePaymentRequest, UpdatePaymentRequest } from '../dto/Payment.request.dto.js';
import { authenticate } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Create payment - requires authentication
router.post(
  '/',
  authenticate,
  validateBody(CreatePaymentRequest),
  paymentController.createPayment
);

// Get user's payments - requires authentication
router.get(
  '/my-payments',
  authenticate,
  paymentController.getUserPayments
);

// Get payments by course - public endpoint (could be restricted)
router.get(
  '/course/:courseId',
  paymentController.getCoursePayments
);

// Get payments by status - could be admin only
router.get(
  '/status/:status',
  paymentController.getPaymentsByStatus
);

// Get payment by ID - requires authentication
router.get(
  '/:paymentId',
  authenticate,
  paymentController.getPaymentById
);

// Update payment - requires authentication (typically for status updates)
router.put(
  '/:paymentId',
  authenticate,
  validateBody(UpdatePaymentRequest),
  paymentController.updatePayment
);

export { router };

