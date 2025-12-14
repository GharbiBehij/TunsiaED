// src/modules/payment/model/entity/Payment.entity.js

/**
 * PaymentEntity - Firestore storage format
 * This is how payment data is stored in Firestore
 *
 * @typedef {Object} PaymentEntity
 * @property {string} userId - User ID who made the payment
 * @property {string} courseId - Course ID being purchased
 * @property {string} courseTitle - Course title for display
 * @property {number} amount - Payment amount
 * @property {string} currency - Currency code
 * @property {string} paymentType - Type of payment
 * @property {string|null} subscriptionType - Subscription type if applicable
 * @property {string|null} paymentMethod - Payment method used
 * @property {string} status - Payment status
 * @property {string|null} transactionId - External transaction ID
 * @property {string|null} stripeSessionId - Stripe session ID (legacy)
 * @property {string|null} paymeeToken - Paymee payment token
 * @property {string|null} checkoutUrl - Paymee checkout URL
 * @property {string|null} failureReason - Reason for payment failure
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const PaymentEntity = {};
