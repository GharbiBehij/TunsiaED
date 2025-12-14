// src/modules/User/model/User.model.js

/**
 * UserModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} UserModel
 * @property {string} uid - User ID (Firebase UID)
 * @property {string} email - User email
 * @property {string|null} name - Display name
 * @property {string|null} phone - Phone number
 * @property {string} [role] - Role as string ('admin' | 'instructor' | 'student') - for onboarding
 * @property {boolean} isAdmin - Admin role flag
 * @property {boolean} isInstructor - Instructor role flag
 * @property {boolean} isStudent - Student role flag
 * @property {string|null} birthDate - Birth date
 * @property {string|null} birthPlace - Birth place
 * @property {string|null} level - Education level
 * @property {string|null} bio - User biography
 * @property {boolean} hasActiveSubscription - Whether user has an active subscription plan
 * @property {string|null} activePlanId - ID of the active subscription plan
 * @property {string|null} subscriptionExpiresAt - ISO date string when subscription expires
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * UserCreateModel - Data for creating a new user
 * 
 * @typedef {Object} UserCreateModel
 * @property {string} email - User email (required)
 * @property {string} [name] - Display name
 * @property {string} [phone] - Phone number
 * @property {string} [role] - Role as string ('admin' | 'instructor' | 'student')
 * @property {boolean} [isAdmin] - Admin role flag
 * @property {boolean} [isInstructor] - Instructor role flag
 * @property {boolean} [isStudent] - Student role flag
 * @property {string} [birthDate] - Birth date
 * @property {string} [birthPlace] - Birth place
 * @property {string} [level] - Education level
 * @property {string} [bio] - User biography
 */

/**
 * UserUpdateModel - Data for updating a user
 * 
 * @typedef {Object} UserUpdateModel
 * @property {string} [name] - Display name
 * @property {string} [phone] - Phone number
 * @property {string} [role] - Role as string (requires admin permission)
 * @property {boolean} [isAdmin] - Admin role flag (requires admin permission)
 * @property {boolean} [isInstructor] - Instructor role flag (requires admin permission)
 * @property {boolean} [isStudent] - Student role flag (requires admin permission)
 * @property {string} [birthDate] - Birth date
 * @property {string} [birthPlace] - Birth place
 * @property {string} [level] - Education level
 * @property {string} [bio] - User biography
 */

export const UserModel = {};
