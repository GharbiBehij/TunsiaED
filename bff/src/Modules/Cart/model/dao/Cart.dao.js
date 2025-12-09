// src/modules/Cart/model/dao/Cart.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'carts';

export class CartDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { cartId: doc.id, ...doc.data() } : null;
  }

  /**
   * Get cart by userId (document ID is userId)
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Raw cart data
   */
  async getCartByUserId(userId) {
    const doc = await this.collection.doc(userId).get();
    return this._docToRaw(doc);
  }

  /**
   * Create or initialize a cart for a user
   * 
   * @param {string} userId - User ID
   * @param {Object} cartData - Initial cart data
   * @returns {Promise<Object>} Created cart data
   */
  async createCart(userId, cartData) {
    const cartDoc = {
      userId,
      items: cartData.items || [],
      itemCount: cartData.itemCount || 0,
      subtotal: cartData.subtotal || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: cartData.expiresAt || null,
    };

    await this.collection.doc(userId).set(cartDoc);
    return { cartId: userId, ...cartDoc };
  }

  /**
   * Update cart data
   * 
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated cart data
   */
  async updateCart(userId, updateData) {
    const finalUpdate = { 
      ...updateData, 
      updatedAt: new Date() 
    };
    
    await this.collection.doc(userId).update(finalUpdate);
    return this.getCartByUserId(userId);
  }

  /**
   * Add an item to cart
   * Uses array-union to prevent duplicates if implemented with transactions
   * 
   * @param {string} userId - User ID
   * @param {Object} item - Cart item to add
   * @returns {Promise<Object>} Updated cart data
   */
  async addItemToCart(userId, item) {
    const cartRef = this.collection.doc(userId);
    const doc = await cartRef.get();

    if (!doc.exists) {
      // Create new cart with this item
      return this.createCart(userId, {
        items: [item],
        itemCount: 1,
        subtotal: item.price,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    // Update existing cart
    const currentData = doc.data();
    const currentItems = currentData.items || [];
    
    // Check if item already exists
    const existingIndex = currentItems.findIndex(
      i => i.courseId === item.courseId
    );

    let updatedItems;
    if (existingIndex >= 0) {
      // Item already in cart - don't add duplicate
      const error = new Error('Course already in cart');
      error.status = 409;
      throw error;
    } else {
      // Add new item
      updatedItems = [...currentItems, item];
    }

    const subtotal = updatedItems.reduce((sum, i) => sum + i.price, 0);

    await cartRef.update({
      items: updatedItems,
      itemCount: updatedItems.length,
      subtotal,
      updatedAt: new Date(),
    });

    return this.getCartByUserId(userId);
  }

  /**
   * Remove an item from cart by itemId
   * 
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID to remove
   * @returns {Promise<Object>} Updated cart data
   */
  async removeItemFromCart(userId, itemId) {
    const cartRef = this.collection.doc(userId);
    const doc = await cartRef.get();

    if (!doc.exists) {
      const error = new Error('Cart not found');
      error.status = 404;
      throw error;
    }

    const currentData = doc.data();
    const currentItems = currentData.items || [];
    
    // Filter out the item
    const updatedItems = currentItems.filter(i => i.itemId !== itemId);

    if (updatedItems.length === currentItems.length) {
      // Item not found
      const error = new Error('Item not found in cart');
      error.status = 404;
      throw error;
    }

    const subtotal = updatedItems.reduce((sum, i) => sum + i.price, 0);

    await cartRef.update({
      items: updatedItems,
      itemCount: updatedItems.length,
      subtotal,
      updatedAt: new Date(),
    });

    return this.getCartByUserId(userId);
  }

  /**
   * Remove an item from cart by courseId
   * 
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID to remove
   * @returns {Promise<Object>} Updated cart data
   */
  async removeItemByCourseId(userId, courseId) {
    const cartRef = this.collection.doc(userId);
    const doc = await cartRef.get();

    if (!doc.exists) {
      const error = new Error('Cart not found');
      error.status = 404;
      throw error;
    }

    const currentData = doc.data();
    const currentItems = currentData.items || [];
    
    // Filter out items with this courseId
    const updatedItems = currentItems.filter(i => i.courseId !== courseId);

    const subtotal = updatedItems.reduce((sum, i) => sum + i.price, 0);

    await cartRef.update({
      items: updatedItems,
      itemCount: updatedItems.length,
      subtotal,
      updatedAt: new Date(),
    });

    return this.getCartByUserId(userId);
  }

  /**
   * Clear all items from cart
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated cart data
   */
  async clearCart(userId) {
    const cartRef = this.collection.doc(userId);
    
    await cartRef.update({
      items: [],
      itemCount: 0,
      subtotal: 0,
      updatedAt: new Date(),
    });

    return this.getCartByUserId(userId);
  }

  /**
   * Delete cart document entirely
   * 
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteCart(userId) {
    await this.collection.doc(userId).delete();
  }

  /**
   * Check if a course is already in the cart
   * 
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} True if course is in cart
   */
  async isCourseInCart(userId, courseId) {
    const cart = await this.getCartByUserId(userId);
    if (!cart || !cart.items) return false;
    
    return cart.items.some(item => item.courseId === courseId);
  }

  /**
   * Get all expired carts (for cleanup job)
   * 
   * @returns {Promise<Array>} Array of expired cart documents
   */
  async getExpiredCarts() {
    const now = new Date();
    const snapshot = await this.collection
      .where('expiresAt', '<=', now)
      .get();
    
    return snapshot.docs.map(doc => ({ cartId: doc.id, ...doc.data() }));
  }
}

export const cartDao = new CartDao();
