// src/modules/Chapter/model/Chapter.model.js

/**
 * ChapterModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} ChapterModel
 * @property {string} chapterId - Chapter ID (Firestore document ID)
 * @property {string} courseId - Parent course ID
 * @property {string} title - Chapter title
 * @property {number} order - Display order within course
 * @property {boolean} isPublished - Whether chapter is visible to students
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * ChapterCreateModel - Data for creating a new chapter
 * 
 * @typedef {Object} ChapterCreateModel
 * @property {string} title - Chapter title (required)
 * @property {number} [order] - Display order (defaults to 0)
 * @property {boolean} [isPublished] - Whether chapter is visible (defaults to false)
 */

/**
 * ChapterUpdateModel - Data for updating a chapter
 * 
 * @typedef {Object} ChapterUpdateModel
 * @property {string} [title] - Chapter title
 * @property {number} [order] - Display order
 * @property {boolean} [isPublished] - Whether chapter is visible
 */

export const ChapterModel = {};
