// src/modules/User/model/entity/User.entity.js

/**
 * UserEntity - Firestore storage format
 * This is how user data is stored in Firestore
 * 
 * @typedef {Object} UserEntity
 * @property {string} uid - User ID (Firebase UID, also document ID)
 * @property {string} email - User email
 * @property {string|null} name - Display name
 * @property {string|null} phone - Phone number
 * @property {boolean} isAdmin - Admin role flag (for Firestore queries)
 * @property {boolean} isInstructor - Instructor role flag (for Firestore queries)
 * @property {boolean} isStudent - Student role flag (for Firestore queries
 * @property {string|null} status - Account status ('pending', 'active', 'suspended'.)
 * @property {string|null} birthDate - Birth date
 * @property {string|null} birthPlace - Birth place
 * @property {string|null} level - Education level
 * @property {string|null} bio - User biography
 * @property {boolean} hasActiveSubscription - Whether user has an active subscription plan
 * @property {string|null} activePlanId - ID of the active subscription plan
 * @property {Date|null} subscriptionExpiresAt - When the subscription expires
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const UserEntity = {};
