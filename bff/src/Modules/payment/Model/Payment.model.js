// src/modules/payment/model/Payment.model.js

/**
 * PaymentModel - Business/API format
 * This is what the frontend sends and receives
 *
 * @typedef {Object} PaymentModel
 * @property {string} paymentId - Payment ID (Firestore document ID)
 * @property {string} userId - User ID who made the payment
 * @property {string} courseId - Course ID being purchased
 * @property {string} courseTitle - Course title for display
 * @property {number} amount - Payment amount (after discount)
 * @property {number|null} originalAmount - Original amount before discount
 * @property {string|null} promoCode - Promo code used
 * @property {number|null} promoDiscount - Discount amount from promo code
 * @property {string} currency - Currency code (default: TND)
 * @property {string} paymentType - Type of payment (course_purchase, subscription)
 * @property {string|null} subscriptionType - Subscription type if applicable
 * @property {string|null} paymentMethod - Payment method used
 * @property {string} status - Payment status (pending, completed, failed, refunded)
 * @property {string|null} transactionId - External transaction ID
 * @property {string|null} stripeSessionId - Stripe session ID (legacy)
 * @property {string|null} paymeeToken - Paymee payment token
 * @property {string|null} checkoutUrl - Paymee checkout URL
 * @property {string|null} failureReason - Reason for payment failure
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * PaymentCreateModel - Data for creating a new payment
 * 
 * @typedef {Object} PaymentCreateModel
 * @property {string} userId - User ID (required)
 * @property {string} courseId - Course ID (required)
 * @property {string} courseTitle - Course title (required)
 * @property {number} amount - Payment amount (required)
 * @property {string} [currency] - Currency code (defaults to TND)
 * @property {string} [paymentType] - Type of payment (defaults to course_purchase)
 * @property {string} [subscriptionType] - Subscription type if applicable
 * @property {string} [paymentMethod] - Payment method used
 */

/**
 * PaymentUpdateModel - Data for updating a payment
 * 
 * @typedef {Object} PaymentUpdateModel
 * @property {string} [status] - Payment status
 * @property {string} [transactionId] - External transaction ID
 * @property {string} [paymentMethod] - Payment method used
 */

export const PaymentModel = {};
