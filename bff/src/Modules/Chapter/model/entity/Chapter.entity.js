// src/modules/Chapter/model/entity/Chapter.entity.js

/**
 * ChapterEntity - Firestore storage format
 * This is how chapter data is stored in Firestore
 * 
 * @typedef {Object} ChapterEntity
 * @property {string} courseId - Parent course ID
 * @property {string} title - Chapter title
 * @property {number} order - Display order within course
 * @property {boolean} isPublished - Whether chapter is visible to students
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const ChapterEntity = {};
