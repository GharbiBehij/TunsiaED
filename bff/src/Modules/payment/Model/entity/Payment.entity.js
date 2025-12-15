// src/modules/payment/model/entity/Payment.entity.js

/**
 * PaymentEntity - Firestore storage format
 * This is how payment data is stored in Firestore
 * @typedef {Object} PaymentEntity
 * @property {string} userId
 * @property {string|null} courseId
 * @property {string} courseTitle
 * @property {number} amount
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
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


export const PaymentEntity = {};
