// bff/src/Modules/Transaction/Api/routes/Transaction.routes.js
import { Router } from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../../middlewares/Role.middleware.js';
import { transactionController } from '../controller/Transaction.controller.js';

const router = Router();

router.post('/', authenticate, transactionController.createTransaction);
router.get('/my-transactions', authenticate, transactionController.getUserTransactions);
router.get('/payment/:paymentId', authenticate, transactionController.getTransactionsByPayment);
router.get('/course/:courseId', authenticate, requireRole('admin', 'instructor'), transactionController.getCourseTransactions);
router.get('/status/:status', authenticate, requireRole('admin'), transactionController.getTransactionsByStatus);
router.get('/:transactionId', authenticate, transactionController.getTransactionById);
router.put('/:transactionId', authenticate, requireRole('admin'), transactionController.updateTransaction);
router.delete('/:transactionId', authenticate, requireRole('admin'), transactionController.deleteTransaction); // If needed

export { router };

