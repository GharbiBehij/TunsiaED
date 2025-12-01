// bff/src/Modules/payment/Api/Payment.routes.js
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { paymentController } from './Payment.controller.js';

const router = Router();

router.post('/', authenticate, paymentController.createPayment);
router.get('/my-payments', authenticate, paymentController.getUserPayments);
router.get('/course/:courseId', paymentController.getCoursePayments);
router.get('/status/:status', paymentController.getPaymentsByStatus);
router.get('/:paymentId', authenticate, paymentController.getPaymentById);
router.put('/:paymentId', authenticate, requireRole('admin'), paymentController.updatePayment);
// If you support delete: router.delete('/:paymentId', authenticate, requireRole('admin'), paymentController.deletePayment);

export { router };

