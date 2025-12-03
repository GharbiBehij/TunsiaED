// Transaction.entity.js
// Firebase/Database format - How data is stored in Firestore
// May include internal fields, timestamps as Firestore Timestamps, etc.

/**
 * @typedef {Object} TransactionEntity
 * @property {string} payment_id - Associated payment ID
 * @property {string} user_id - User who made the transaction
 * @property {string} course_id - Course being purchased
 * @property {string} course_title - Title of the course
 * @property {number} amount - Transaction amount
 * @property {string} currency - Currency code
 * @property {string} status - Transaction status
 * @property {string} payment_method - Payment method used
 * @property {string} payment_gateway - Payment gateway
 * @property {string|null} gateway_transaction_id - External gateway transaction ID
 * @property {Object|null} gateway_response - Raw gateway response (stored as object)
 * @property {FirebaseFirestore.Timestamp} created_at - Firestore timestamp
 * @property {FirebaseFirestore.Timestamp} updated_at - Firestore timestamp
 * @property {FirebaseFirestore.Timestamp|null} completed_at - Firestore timestamp
 */

/**
 * Creates a new TransactionEntity for Firestore storage
 * @param {Object} data 
 * @returns {TransactionEntity}
 */
export function createTransactionEntity(data = {}) {
  const now = new Date();
  return {
    payment_id: data.payment_id || null,
    user_id: data.user_id || null,
    course_id: data.course_id || null,
    course_title: data.course_title || null,
    amount: data.amount || 0,
    currency: data.currency || 'TND',
    status: data.status || 'pending',
    payment_method: data.payment_method || null,
    payment_gateway: data.payment_gateway || null,
    gateway_transaction_id: data.gateway_transaction_id || null,
    gateway_response: data.gateway_response || null,
    created_at: data.created_at || now,
    updated_at: data.updated_at || now,
    completed_at: data.completed_at || null,
  };
}
