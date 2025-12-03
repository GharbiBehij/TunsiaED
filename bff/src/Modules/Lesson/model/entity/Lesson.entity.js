// src/modules/Lesson/model/entity/Lesson.entity.js

/**
 * LessonEntity - Firestore storage format
 * This is how lesson data is stored in Firestore
 * 
 * @typedef {Object} LessonEntity
 * @property {string} courseId - Parent course ID
 * @property {string} chapterId - Parent chapter ID
 * @property {string} title - Lesson title
 * @property {number} order - Display order within chapter
 * @property {number|null} durationMinutes - Lesson duration in minutes
 * @property {boolean} isPublished - Whether lesson is visible to students
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const LessonEntity = {};
