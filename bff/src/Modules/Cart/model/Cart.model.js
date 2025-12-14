// src/modules/Cart/model/Cart.model.js

/**
 * CartItemModel - Business/API format for a cart item
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} CartItemModel
 * @property {string} itemId - Unique item ID (generated)
 * @property {string} courseId - Course ID being purchased
 * @property {string} courseTitle - Course title for display
 * @property {string} instructorName - Instructor name for display
 * @property {number} price - Course price at time of adding to cart
 * @property {string|null} thumbnailUrl - Course thumbnail URL
 * @property {string} addedAt - ISO date string when added to cart
 */

/**
 * CartModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} CartModel
 * @property {string} cartId - Cart ID (typically userId)
 * @property {string} userId - User ID who owns the cart
 * @property {CartItemModel[]} items - Array of cart items
 * @property {number} itemCount - Total number of items
 * @property {number} subtotal - Total price of all items
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {string|null} expiresAt - ISO date string when cart expires (optional)
 */

/**
 * AddToCartModel - Data for adding an item to cart
 * 
 * @typedef {Object} AddToCartModel
 * @property {string} userId - User ID (required)
 * @property {string} courseId - Course ID (required)
 * @property {string} courseTitle - Course title (required)
 * @property {string} instructorName - Instructor name (required)
 * @property {number} price - Course price (required)
 * @property {string} [thumbnailUrl] - Course thumbnail URL
 */

/**
 * RemoveFromCartModel - Data for removing an item from cart
 * 
 * @typedef {Object} RemoveFromCartModel
 * @property {string} userId - User ID (required)
 * @property {string} itemId - Item ID to remove (required)
 */

/**
 * CartSyncModel - Data for syncing localStorage cart with Firestore
 * 
 * @typedef {Object} CartSyncModel
 * @property {string} userId - User ID (required)
 * @property {Object[]} localItems - Items from localStorage
 * @property {string} localItems[].courseId - Course ID
 * @property {string} localItems[].title - Course title
 * @property {string} localItems[].instructor - Instructor name
 * @property {number} localItems[].price - Course price
 * @property {string} [localItems[].thumbnailUrl] - Thumbnail URL
 */

export const CartModel = {};
