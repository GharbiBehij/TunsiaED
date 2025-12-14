// bff/src/Modules/Cart/api/Cart.routes.js
import express from 'express';
import { cartController } from './Cart.controller.js';
import { authenticate } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/', (req, res) => cartController.getCart(req, res));

// Get cart summary (lightweight)
router.get('/summary', (req, res) => cartController.getCartSummary(req, res));

// Check if course is in cart
router.get('/check/:courseId', (req, res) => cartController.checkCourseInCart(req, res));

// Add item to cart
router.post('/items', (req, res) => cartController.addToCart(req, res));

// Sync localStorage cart with Firestore
router.post('/sync', (req, res) => cartController.syncCart(req, res));

// Remove item from cart by itemId
router.delete('/items/:itemId', (req, res) => cartController.removeFromCart(req, res));

// Remove item from cart by courseId
router.delete('/courses/:courseId', (req, res) => cartController.removeFromCartByCourseId(req, res));

// Clear all items from cart
router.delete('/', (req, res) => cartController.clearCart(req, res));

const CartRouter = router;
export default CartRouter;
