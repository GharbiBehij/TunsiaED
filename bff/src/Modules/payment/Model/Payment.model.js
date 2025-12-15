// src/modules/payment/model/Payment.model.js

/**
 * PaymentModel - Business/API format
 * This is what the frontend sends and receives
 *
/**
 * @typedef {Object} PaymentModel
 * @property {string} paymentId
 * @property {string} userId
 * @property {string|null} courseId
 * @property {string} courseTitle
 * @property {number} amount
 * @property {number|null} originalAmount
 * @property {string|null} promoCode
 * @property {number|null} promoDiscount
 * @property {string} currency
 * @property {'course_purchase'|'bundle_purchase'|'subscription'} paymentType
 * @property {string|null} subscriptionType
 * @property {string|null} paymentMethod
 * @property {string} status
 * @property {Array<{ courseId: string, courseTitle: string, price: number }>|null} cartItems
 * @property {string|null} transactionId
 * @property {string|null} stripeSessionId
 * @property {string|null} paymeeToken
 * @property {string|null} checkoutUrl
 * @property {string|null} failureReason
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * PaymentCreateModel - Data for creating a new payment
 * 
/**
 * @typedef {Object} PaymentCreateModel
 * @property {string} userId
 * @property {string} [courseId]    // optional for bundles
 * @property {Array<{ courseId: string, courseTitle: string, price: number }>} [cartItems]
 * @property {string} courseTitle
 * @property {number} amount
 * @property {string} [currency]
 * @property {'course_purchase'|'bundle_purchase'|'subscription'} [paymentType]
 * @property {string} [subscriptionType]
 * @property {string} [paymentMethod]
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
