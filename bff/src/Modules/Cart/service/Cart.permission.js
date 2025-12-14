// src/modules/Cart/service/Cart.permission.js

/**
 * CartPermission - Authorization rules for cart operations
 */
export const CartPermission = {
  /**
   * Check if user can view a cart
   * Users can only view their own cart
   * Admins can view any cart
   * 
   * @param {Object} user - User object with uid and role
   * @param {string} cartUserId - User ID of the cart owner
   * @returns {boolean}
   */
  view(user, cartUserId) {
    if (!user) return false;
    
    // Admin can view any cart
    if (user.role === 'admin') return true;
    
    // User can view their own cart
    return user.uid === cartUserId;
  },

  /**
   * Check if user can modify a cart (add/remove items)
   * Users can only modify their own cart
   * 
   * @param {Object} user - User object with uid
   * @param {string} cartUserId - User ID of the cart owner
   * @returns {boolean}
   */
  modify(user, cartUserId) {
    if (!user) return false;
    
    // User can only modify their own cart
    return user.uid === cartUserId;
  },

  /**
   * Check if user can clear a cart
   * Users can clear their own cart
   * Admins can clear any cart
   * 
   * @param {Object} user - User object with uid and role
   * @param {string} cartUserId - User ID of the cart owner
   * @returns {boolean}
   */
  clear(user, cartUserId) {
    if (!user) return false;
    
    // Admin can clear any cart
    if (user.role === 'admin') return true;
    
    // User can clear their own cart
    return user.uid === cartUserId;
  },

  /**
   * Check if user can sync cart
   * Only the cart owner can sync
   * 
   * @param {Object} user - User object with uid
   * @param {string} cartUserId - User ID of the cart owner
   * @returns {boolean}
   */
  sync(user, cartUserId) {
    if (!user) return false;
    return user.uid === cartUserId;
  },
};
