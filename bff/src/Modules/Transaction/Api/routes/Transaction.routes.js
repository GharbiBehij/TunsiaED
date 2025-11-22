// src/modules/Transaction/Api/routes/Transaction.routes.js
import { Router } from 'express';
import { transactionController } from '../controller/Transaction.controller.js';
import { authenticate } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Create transaction - requires authentication
router.post(
  '/',
  authenticate,
  transactionController.createTransaction
);

// Get user's transactions - requires authentication
router.get(
  '/my-transactions',
  authenticate,
  transactionController.getUserTransactions
);

// Get transactions by payment - requires authentication
router.get(
  '/payment/:paymentId',
  authenticate,
  transactionController.getTransactionsByPayment
);

// Get transactions by course - could be public or restricted
router.get(
  '/course/:courseId',
  transactionController.getCourseTransactions
);

// Get transactions by status - could be admin only
router.get(
  '/status/:status',
  transactionController.getTransactionsByStatus
);

// Get transaction by ID - requires authentication
router.get(
  '/:transactionId',
  authenticate,
  transactionController.getTransactionById
);

// Update transaction - requires authentication (typically for status updates)
router.put(
  '/:transactionId',
  authenticate,
  transactionController.updateTransaction
);

export { router };

