// bff/src/Modules/payment/Api/Payment.routes.js
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { paymentController } from './Payment.controller.js';
import { subscriptionController } from './Subscription.controller.js';

const router = Router();

// DIRECT SERVICE ROUTES - Single module operations
router.post('/', authenticate, paymentController.createPayment);
router.get('/my-payments', authenticate, paymentController.getUserPayments);
router.get('/course/:courseId', authenticate, requireRole('admin', 'instructor'), paymentController.getCoursePayments);
router.get('/status/:status', authenticate, requireRole('admin'), paymentController.getPaymentsByStatus);
router.get('/:paymentId', authenticate, paymentController.getPaymentById);
router.put('/:paymentId', authenticate, requireRole('admin'), paymentController.updatePayment);

// ORCHESTRATED ROUTES - Cross-module purchase flow
// Initiate purchase orchestrator - creates payment with validation
router.post('/purchase/initiate', authenticate, paymentController.initiatePurchase);
// Complete purchase orchestrator - creates transaction and enrollment
router.post('/purchase/complete', authenticate, paymentController.completePurchase);
// Purchase status orchestrator - returns complete purchase status
router.get('/purchase/:paymentId/status', authenticate, paymentController.getPurchaseStatus);

// STRIPE GATEWAY ROUTES - International payment gateway integration
// Initiate Stripe payment - creates payment and returns Stripe Checkout URL
//router.post('/stripe/initiate', authenticate, paymentController.initiateStripePayment);
// Stripe webhook - receives payment status from Stripe (no auth, verified by signature)
//router.post('/stripe/webhook', paymentController.handleStripeWebhook);
// Check Stripe payment status by session ID
//router.get('/stripe/status/:token', authenticate, paymentController.getStripePaymentStatus);

router.post('/paymee/initiate', authenticate, paymentController.initiatePayment);
router.post('/paymee/webhook', paymentController.processWebhook);
router.get('/paymee/status/:token', authenticate, paymentController.getPaymentStatus);

// MANUAL PAYMENT SIMULATION (for testing when payment gateway is unavailable)
// Simulates a payment and sends email notification
router.post('/simulate', authenticate, paymentController.simulatePayment);

// SUBSCRIPTION PLANS (PUBLIC - for subscription page)
router.get('/subscriptions/plans', subscriptionController.getSubscriptionPlans);
router.get('/subscriptions/plans/:planId', subscriptionController.getSubscriptionPlanById);

export { router };

