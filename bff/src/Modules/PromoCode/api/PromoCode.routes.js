// bff/src/Modules/ShoppingCart/api/PromoCode.routes.js
import express from 'express';
import { promoCodeController } from './PromoCode.controller.js';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';

const router = express.Router();

// Public route - validate promo code (no authentication required)
router.post('/validate', promoCodeController.validatePromoCode.bind(promoCodeController));

// Admin routes - require authentication and admin role
router.post('/', authenticate, requireRole('admin'), promoCodeController.createPromoCode.bind(promoCodeController));
router.get('/', authenticate, requireRole('admin'), promoCodeController.getAllPromoCodes.bind(promoCodeController));
router.patch('/:promoCodeId', authenticate, requireRole('admin'), promoCodeController.updatePromoCode.bind(promoCodeController));
router.delete('/:promoCodeId', authenticate, requireRole('admin'), promoCodeController.deletePromoCode.bind(promoCodeController));

export default router;
