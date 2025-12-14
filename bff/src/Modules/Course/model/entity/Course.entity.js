// src/modules/Course/model/entity/Course.entity.js

/**
 * CourseEntity - Firestore storage format
 * This is how course data is stored in Firestore
 * 
 * @typedef {Object} CourseEntity
 * @property {string} title - Course title
 * @property {string} description - Course description
 * @property {string} instructorId - Instructor's user ID
 * @property {string} instructorName - Instructor's display name
 * @property {string} category - Course category
 * @property {string} level - Difficulty level
 * @property {number} price - Course price
 * @property {string|null} thumbnail - Thumbnail URL
 * @property {number} duration - Estimated duration in hours
 * @property {number} enrolledCount - Number of enrolled students
 * @property {boolean} [isSystemCourse] - Indicates courses seeded by the platform
 * @property {number} rating - Average rating
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const CourseEntity = {};
