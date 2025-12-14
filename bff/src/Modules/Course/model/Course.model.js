// src/modules/Course/model/Course.model.js

/**
 * CourseModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} CourseModel
 * @property {string} courseId - Course ID (Firestore document ID)
 * @property {string} title - Course title
 * @property {string} description - Course description
 * @property {string} instructorId - Instructor's user ID
 * @property {string} instructorName - Instructor's display name
 * @property {string} category - Course category
 * @property {string} level - Difficulty level (beginner, intermediate, advanced)
 * @property {number} price - Course price
 * @property {string|null} thumbnail - Thumbnail URL
 * @property {number} duration - Estimated duration in hours
 * @property {number} enrolledCount - Number of enrolled students
 * @property {number} rating - Average rating (0-5)
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * CourseCreateModel - Data for creating a new course
 * 
 * @typedef {Object} CourseCreateModel
 * @property {string} title - Course title (required)
 * @property {string} description - Course description (required)
 * @property {string} category - Course category (required)
 * @property {string} level - Difficulty level (required)
 * @property {number} price - Course price (required)
 * @property {string} [thumbnail] - Thumbnail URL
 * @property {number} duration - Estimated duration in hours (required)
 */

/**
 * CourseUpdateModel - Data for updating a course
 * 
 * @typedef {Object} CourseUpdateModel
 * @property {string} [title] - Course title
 * @property {string} [description] - Course description
 * @property {string} [category] - Course category
 * @property {string} [level] - Difficulty level
 * @property {number} [price] - Course price
 * @property {string} [thumbnail] - Thumbnail URL
 * @property {number} [duration] - Estimated duration in hours
 */

export const CourseModel = {};
