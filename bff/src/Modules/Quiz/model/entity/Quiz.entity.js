// src/modules/Quiz/model/entity/Quiz.entity.js

/**
 * QuizEntity - Firestore storage format
 * This is how quiz data is stored in Firestore
 * 
 * @typedef {Object} QuizEntity
 * @property {string} courseId - Parent course ID
 * @property {string|null} lessonId - Parent lesson ID (optional)
 * @property {string} title - Quiz title
 * @property {number} totalQuestions - Number of questions in quiz
 * @property {number} passingScore - Minimum score to pass
 * @property {boolean} isPublished - Whether quiz is visible to students
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const QuizEntity = {};
