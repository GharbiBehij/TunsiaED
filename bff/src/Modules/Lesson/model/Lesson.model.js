// src/modules/Lesson/model/Lesson.model.js

/**
 * LessonModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} LessonModel
 * @property {string} lessonId - Lesson ID (Firestore document ID)
 * @property {string} courseId - Parent course ID
 * @property {string} chapterId - Parent chapter ID
 * @property {string} title - Lesson title
 * @property {number} order - Display order within chapter
 * @property {number|null} durationMinutes - Lesson duration in minutes
 * @property {boolean} isPublished - Whether lesson is visible to students
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * LessonCreateModel - Data for creating a new lesson
 * 
 * @typedef {Object} LessonCreateModel
 * @property {string} title - Lesson title (required)
 * @property {number} [order] - Display order (defaults to 0)
 * @property {number} [durationMinutes] - Lesson duration in minutes
 * @property {boolean} [isPublished] - Whether lesson is visible (defaults to false)
 */

/**
 * LessonUpdateModel - Data for updating a lesson
 * 
 * @typedef {Object} LessonUpdateModel
 * @property {string} [title] - Lesson title
 * @property {number} [order] - Display order
 * @property {number} [durationMinutes] - Lesson duration in minutes
 * @property {boolean} [isPublished] - Whether lesson is visible
 */

export const LessonModel = {};
