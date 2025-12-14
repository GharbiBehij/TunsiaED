// src/modules/Cart/service/Cart.service.js
import { cartRepository } from '../repository/Cart.repository.js';
import { CartMapper } from '../mapper/Cart.mapper.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';

export class CartService {
  /**
   * Helper: Convert raw entity to model
   */
  _toModel(raw) {
    return raw ? CartMapper.toModel(raw.cartId, raw) : null;
  }

  /**
   * Get user's cart
   * Creates empty cart if doesn't exist
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} CartModel
   */
  async getCart(userId) {
    if (!userId) {
      const error = new Error('userId is required');
      error.status = 400;
      throw error;
    }

    let raw = await cartRepository.findByUserId(userId);
    
    // Create empty cart if doesn't exist
    if (!raw) {
      raw = await cartRepository.createCart(userId, {
        items: [],
        itemCount: 0,
        subtotal: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    return this._toModel(raw);
  }

  /**
   * Add course to cart
   * Validates course exists and user doesn't already own it
   * 
   * @param {string} userId - User ID
   * @param {Object} data - AddToCartModel
   * @returns {Promise<Object>} Updated CartModel
   */
  async addToCart(userId, data) {
    // Validate input
    CartMapper.validateAddToCart({ ...data, userId });

    // Check if course exists
    const course = await courseRepository.findByCourseId(data.courseId);
    if (!course) {
      const error = new Error('Course not found');
      error.status = 404;
      throw error;
    }

    // TODO: Check if user already enrolled in this course
    // const isEnrolled = await enrollmentRepository.isUserEnrolled(userId, data.courseId);
    // if (isEnrolled) {
    //   const error = new Error('Already enrolled in this course');
    //   error.status = 409;
    //   throw error;
    // }

    // Create cart item entity
    const item = CartMapper.itemToEntity({
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      instructorName: data.instructorName,
      price: data.price,
      thumbnailUrl: data.thumbnailUrl,
    });

    // Add to cart (DAO handles duplicate check)
    const raw = await cartRepository.addItem(userId, item);
    return this._toModel(raw);
  }

  /**
   * Remove item from cart by itemId
   * 
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID to remove
   * @returns {Promise<Object>} Updated CartModel
   */
  async removeFromCart(userId, itemId) {
    CartMapper.validateRemoveFromCart({ userId, itemId });

    const raw = await cartRepository.removeItem(userId, itemId);
    return this._toModel(raw);
  }

  /**
   * Remove item from cart by courseId
   * Useful after successful purchase
   * 
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID to remove
   * @returns {Promise<Object>} Updated CartModel
   */
  async removeFromCartByCourseId(userId, courseId) {
    if (!userId || !courseId) {
      const error = new Error('userId and courseId are required');
      error.status = 400;
      throw error;
    }

    const raw = await cartRepository.removeItemByCourseId(userId, courseId);
    return this._toModel(raw);
  }

  /**
   * Clear all items from cart
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated CartModel
   */
  async clearCart(userId) {
    if (!userId) {
      const error = new Error('userId is required');
      error.status = 400;
      throw error;
    }

    const raw = await cartRepository.clearCart(userId);
    return this._toModel(raw);
  }

  /**
   * Sync localStorage cart with Firestore after login
   * Merges local items with existing cart, avoiding duplicates
   * 
   * @param {string} userId - User ID
   * @param {Array} localItems - Items from localStorage
   * @returns {Promise<Object>} Updated CartModel
   */
  async syncCart(userId, localItems) {
    if (!userId) {
      const error = new Error('userId is required');
      error.status = 400;
      throw error;
    }

    if (!Array.isArray(localItems) || localItems.length === 0) {
      // No local items to sync, just return existing cart
      return this.getCart(userId);
    }

    // Get or create cart
    let cart = await this.getCart(userId);

    // Get existing course IDs in cart
    const existingCourseIds = new Set(
      cart.items.map(item => item.courseId)
    );

    // Add items from localStorage that aren't already in cart
    for (const localItem of localItems) {
      if (!existingCourseIds.has(localItem.courseId)) {
        try {
          // Convert localStorage format to API format
          const normalizedItem = CartMapper.fromLocalStorageItem(localItem);
          
          // Add to cart
          cart = await this.addToCart(userId, {
            userId,
            ...normalizedItem,
          });
          
          existingCourseIds.add(localItem.courseId);
        } catch (error) {
          // Skip items that fail to add (e.g., course not found, already enrolled)
          console.error(`Failed to sync item ${localItem.courseId}:`, error.message);
        }
      }
    }

    return cart;
  }

  /**
   * Check if course is in user's cart
   * 
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>}
   */
  async isCourseInCart(userId, courseId) {
    if (!userId || !courseId) return false;
    
    return await cartRepository.isCourseInCart(userId, courseId);
  }

  /**
   * Get cart summary (itemCount and subtotal only)
   * Lightweight endpoint for header badge
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} { itemCount, subtotal }
   */
  async getCartSummary(userId) {
    const cart = await this.getCart(userId);
    return {
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
    };
  }

  /**
   * Cleanup expired carts (cron job)
   * 
   * @returns {Promise<number>} Number of carts deleted
   */
  async cleanupExpiredCarts() {
    const expiredCarts = await cartRepository.findExpiredCarts();
    
    for (const cart of expiredCarts) {
      await cartRepository.deleteCart(cart.cartId);
    }
    
    return expiredCarts.length;
  }

  /**
   * Update cart item price (admin only, when course price changes)
   * 
   * @param {string} courseId - Course ID
   * @param {number} newPrice - New course price
   * @returns {Promise<number>} Number of carts updated
   */
  async updateItemPriceAcrossCarts(courseId, newPrice) {
    // This would require a query across all carts
    // Implementation depends on whether you want to update prices
    // in carts automatically or let them keep the original price
    // For now, leaving as TODO
    throw new Error('Not implemented - requires collection group query');
  }
}

export const cartService = new CartService();
