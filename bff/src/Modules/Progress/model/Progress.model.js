// src/modules/Progress/model/Progress.model.js

/**
 * @typedef {Object} ProgressModel
 * @property {string} progressId - Progress document ID
 * @property {string} enrollmentId - Enrollment ID
 * @property {string} moduleType - Module type ('course', 'quiz', 'lesson', 'chapter')
 * @property {string} moduleId - Module ID
 * @property {string} userId - User ID
 * @property {number} progress - Progress percentage (0-100)
 * @property {string[]} completedItems - Array of completed item IDs
 * @property {number} totalItems - Total number of items
 * @property {boolean} completed - Whether progress is complete
 * @property {string} startedAt - ISO date string when started
 * @property {string|null} completedAt - ISO date string when completed
 * @property {string} lastAccessedAt - ISO date string of last access
 * @property {string} createdAt - ISO date string of creation
 * @property {string} updatedAt - ISO date string of last update
 */

/**
 * @typedef {Object} ProgressCreateModel
 * @property {string} enrollmentId - Enrollment ID
 * @property {string} moduleType - Module type
 * @property {string} moduleId - Module ID
 * @property {string} userId - User ID
 * @property {number} [totalItems] - Total number of items
 */

/**
 * @typedef {Object} ProgressUpdateModel
 * @property {number} [progress] - Progress percentage
 * @property {string[]} [completedItems] - Completed item IDs
 * @property {number} [totalItems] - Total items
 * @property {boolean} [completed] - Completion status
 */

export const ProgressModel = {};
