// Transaction.model.js
// Business/Frontend format - What the API returns to clients
// Clean, camelCase, user-friendly structure

/**
 * @typedef {Object} TransactionModel
 * @property {string} transactionId - Unique transaction ID
 * @property {string} paymentId - Associated payment ID
 * @property {string} userId - User who made the transaction
 * @property {string} courseId - Course being purchased
 * @property {string} courseTitle - Title of the course
 * @property {number} amount - Transaction amount
 * @property {string} currency - Currency code (TND, USD, EUR)
 * @property {string} status - Transaction status (pending, completed, failed, refunded)
 * @property {string} paymentMethod - Payment method used (stripe, card, paypal)
 * @property {string} paymentGateway - Payment gateway (stripe, paypal)
 * @property {string|null} gatewayTransactionId - External gateway transaction ID
 * @property {string|null} gatewayResponse - Raw gateway response
 * @property {Date} createdAt - When transaction was created
 * @property {Date} updatedAt - When transaction was last updated
 * @property {Date|null} completedAt - When transaction was completed
 */

/**
 * Creates a new TransactionModel with defaults
 * @param {Partial<TransactionModel>} data 
 * @returns {TransactionModel}
 */
export function createTransactionModel(data = {}) {
  return {
    transactionId: data.transactionId || null,
    paymentId: data.paymentId || null,
    userId: data.userId || null,
    courseId: data.courseId || null,
    courseTitle: data.courseTitle || null,
    amount: data.amount || 0,
    currency: data.currency || 'TND',
    status: data.status || 'pending',
    paymentMethod: data.paymentMethod || null,
    paymentGateway: data.paymentGateway || null,
    gatewayTransactionId: data.gatewayTransactionId || null,
    gatewayResponse: data.gatewayResponse || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    completedAt: data.completedAt || null,
  };
}

/**
 * Transaction status enum
 */
export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

/**
 * Payment method enum
 */
export const PaymentMethod = {
  STRIPE: 'stripe',
  PAYMEE: 'paymee', // Legacy
  CARD: 'card',
  PAYPAL: 'paypal',
};
