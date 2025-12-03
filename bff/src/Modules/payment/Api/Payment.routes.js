// bff/src/Modules/payment/Api/Payment.routes.js
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { paymentController } from './Payment.controller.js';

const router = Router();

// DIRECT SERVICE ROUTES - Single module operations
router.post('/', authenticate, paymentController.createPayment);
router.get('/my-payments', authenticate, paymentController.getUserPayments);
router.get('/course/:courseId', paymentController.getCoursePayments);
router.get('/status/:status', paymentController.getPaymentsByStatus);
router.get('/:paymentId', authenticate, paymentController.getPaymentById);
router.put('/:paymentId', authenticate, requireRole('admin'), paymentController.updatePayment);

// ORCHESTRATED ROUTES - Cross-module purchase flow
// Initiate purchase orchestrator - creates payment with validation
router.post('/purchase/initiate', authenticate, paymentController.initiatePurchase);
// Complete purchase orchestrator - creates transaction and enrollment
router.post('/purchase/complete', authenticate, paymentController.completePurchase);
// Purchase status orchestrator - returns complete purchase status
router.get('/purchase/:paymentId/status', authenticate, paymentController.getPurchaseStatus);

// PAYMEE GATEWAY ROUTES - Tunisian payment gateway integration
// Initiate Paymee payment - creates payment and returns gateway URL for iframe
router.post('/paymee/initiate', authenticate, paymentController.initiatePaymeePayment);
// Paymee webhook - receives payment status from Paymee (no auth, verified by checksum)
router.post('/paymee/webhook', paymentController.handlePaymeeWebhook);
// Check Paymee payment status by token
router.get('/paymee/status/:token', authenticate, paymentController.getPaymeePaymentStatus);

// MANUAL PAYMENT SIMULATION (for testing while Paymee sandbox is down)
// Simulates a payment and sends email notification
router.post('/simulate', authenticate, paymentController.simulatePayment);

export { router };

