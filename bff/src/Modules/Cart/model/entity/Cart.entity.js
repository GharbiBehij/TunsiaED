// src/modules/Cart/model/entity/Cart.entity.js

/**
 * CartItemEntity - Firestore format for a cart item
 * Stored as array elements within the cart document
 * 
 * @typedef {Object} CartItemEntity
 * @property {string} itemId - Unique item ID (cart-{courseId}-{timestamp})
 * @property {string} courseId - Reference to Course document
 * @property {string} courseTitle - Denormalized for performance
 * @property {string} instructorName - Denormalized for performance
 * @property {number} price - Price snapshot at time of adding
 * @property {string|null} thumbnailUrl - Course thumbnail
 * @property {Date} addedAt - Firestore Timestamp when added
 */

/**
 * CartEntity - Firestore document format
 * Stored at /carts/{userId}
 * 
 * @typedef {Object} CartEntity
 * @property {string} userId - User ID (also the document ID)
 * @property {CartItemEntity[]} items - Array of cart items
 * @property {number} itemCount - Cached count for performance
 * @property {number} subtotal - Cached subtotal for performance
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 * @property {Date|null} expiresAt - Optional expiration (e.g., 30 days)
 */

export const CartEntity = {};
