// bff/src/Modules/Cart/api/Cart.controller.js
import { cartService } from '../service/Cart.service.js';
import { CartPermission } from '../service/Cart.permission.js';

export class CartController {
  /**
   * GET /api/cart
   * Get current user's cart
   */
  async getCart(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check permission
      if (!CartPermission.view(req.user, userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const cart = await cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * GET /api/cart/summary
   * Get cart summary (lightweight - itemCount and subtotal only)
   */
  async getCartSummary(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const summary = await cartService.getCartSummary(userId);
      res.status(200).json(summary);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * POST /api/cart/items
   * Add item to cart
   * Body: { courseId, courseTitle, instructorName, price, thumbnailUrl? }
   */
  async addToCart(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check permission
      if (!CartPermission.modify(req.user, userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const data = req.body;
      const cart = await cartService.addToCart(userId, data);
      
      res.status(201).json(cart);
    } catch (error) {
      if (error.status === 409) {
        return res.status(409).json({ error: error.message });
      }
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/cart/items/:itemId
   * Remove item from cart by itemId
   */
  async removeFromCart(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check permission
      if (!CartPermission.modify(req.user, userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { itemId } = req.params;
      const cart = await cartService.removeFromCart(userId, itemId);
      
      res.status(200).json(cart);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/cart/courses/:courseId
   * Remove item from cart by courseId
   */
  async removeFromCartByCourseId(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check permission
      if (!CartPermission.modify(req.user, userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { courseId } = req.params;
      const cart = await cartService.removeFromCartByCourseId(userId, courseId);
      
      res.status(200).json(cart);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/cart
   * Clear all items from cart
   */
  async clearCart(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check permission
      if (!CartPermission.clear(req.user, userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const cart = await cartService.clearCart(userId);
      
      res.status(200).json(cart);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  /**
   * POST /api/cart/sync
   * Sync localStorage cart with Firestore after login
   * Body: { items: [{ courseId, title, instructor, price, thumbnailUrl? }] }
   */
  async syncCart(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check permission
      if (!CartPermission.sync(req.user, userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { items } = req.body;
      const cart = await cartService.syncCart(userId, items || []);
      
      res.status(200).json(cart);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  /**
   * GET /api/cart/check/:courseId
   * Check if course is in cart
   */
  async checkCourseInCart(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { courseId } = req.params;
      const isInCart = await cartService.isCourseInCart(userId, courseId);
      
      res.status(200).json({ isInCart });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export const cartController = new CartController();
