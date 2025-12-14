// src/modules/Cart/repository/Cart.repository.js
import { cartDao } from '../model/dao/Cart.dao.js';

export class CartRepository {
  /**
   * Get cart by user ID
   */
  async findByUserId(userId) {
    return await cartDao.getCartByUserId(userId);
  }

  /**
   * Create a new cart
   */
  async createCart(userId, cartData) {
    return await cartDao.createCart(userId, cartData);
  }

  /**
   * Update cart
   */
  async updateCart(userId, updateData) {
    return await cartDao.updateCart(userId, updateData);
  }

  /**
   * Add item to cart
   */
  async addItem(userId, item) {
    return await cartDao.addItemToCart(userId, item);
  }

  /**
   * Remove item from cart by itemId
   */
  async removeItem(userId, itemId) {
    return await cartDao.removeItemFromCart(userId, itemId);
  }

  /**
   * Remove item from cart by courseId
   */
  async removeItemByCourseId(userId, courseId) {
    return await cartDao.removeItemByCourseId(userId, courseId);
  }

  /**
   * Clear all items from cart
   */
  async clearCart(userId) {
    return await cartDao.clearCart(userId);
  }

  /**
   * Delete cart entirely
   */
  async deleteCart(userId) {
    return await cartDao.deleteCart(userId);
  }

  /**
   * Check if course is in cart
   */
  async isCourseInCart(userId, courseId) {
    return await cartDao.isCourseInCart(userId, courseId);
  }

  /**
   * Get expired carts
   */
  async findExpiredCarts() {
    return await cartDao.getExpiredCarts();
  }
}

export const cartRepository = new CartRepository();
