// src/modules/Enrollement/model/entity/Enrollment.entity.js

/**
 * EnrollmentEntity - Firestore storage format
 * This is how enrollment data is stored in Firestore
 * 
 * @typedef {Object} EnrollmentEntity
 * @property {string} userId - User ID who enrolled
 * @property {string} courseId - Course ID enrolled in
 * @property {Date} enrollmentDate - Firestore Timestamp of enrollment
 * @property {string} status - Enrollment status
 * @property {string|null} paymentId - Associated payment ID
 * @property {string|null} transactionId - Associated transaction ID
 * @property {number} [progress] - Progress percentage
 * @property {string[]} [completedLessons] - Array of completed lesson IDs
 * @property {boolean} [completed] - Whether course is completed
 * @property {Date} [updatedAt] - Firestore Timestamp of last update
 */

export const EnrollmentEntity = {};
