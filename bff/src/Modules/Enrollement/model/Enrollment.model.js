// src/modules/Enrollement/model/Enrollment.model.js

/**
 * EnrollmentModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} EnrollmentModel
 * @property {string} enrollmentId - Enrollment ID (Firestore document ID)
 * @property {string} userId - User ID who enrolled
 * @property {string} courseId - Course ID enrolled in
 * @property {string} enrollmentDate - ISO date string of enrollment
 * @property {string} status - Enrollment status (active, completed, cancelled)
 * @property {string|null} paymentId - Associated payment ID
 * @property {string|null} transactionId - Associated transaction ID
 * @property {number} progress - Progress percentage (0-100)
 * @property {string[]} completedLessons - Array of completed lesson IDs
 * @property {boolean} completed - Whether course is completed
 * @property {string} [updatedAt] - ISO date string of last update
 */

/**
 * EnrollmentCreateModel - Data for creating a new enrollment
 * 
 * @typedef {Object} EnrollmentCreateModel
 * @property {string} courseId - Course ID (required)
 */

/**
 * EnrollmentProgressUpdateModel - Data for updating enrollment progress
 * 
 * @typedef {Object} EnrollmentProgressUpdateModel
 * @property {number} [progress] - Progress percentage
 * @property {string[]} [completedLessons] - Array of completed lesson IDs
 * @property {boolean} [completed] - Whether course is completed
 */

export const EnrollmentModel = {};
