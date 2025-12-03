// src/modules/Quiz/model/Quiz.model.js

/**
 * QuizModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} QuizModel
 * @property {string} quizId - Quiz ID (Firestore document ID)
 * @property {string} courseId - Parent course ID
 * @property {string|null} lessonId - Parent lesson ID (optional)
 * @property {string} title - Quiz title
 * @property {number} totalQuestions - Number of questions in quiz
 * @property {number} passingScore - Minimum score to pass
 * @property {boolean} isPublished - Whether quiz is visible to students
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * QuizCreateModel - Data for creating a new quiz
 * 
 * @typedef {Object} QuizCreateModel
 * @property {string} title - Quiz title (required)
 * @property {number} [totalQuestions] - Number of questions (defaults to 0)
 * @property {number} [passingScore] - Minimum passing score (defaults to 0)
 * @property {boolean} [isPublished] - Whether quiz is visible (defaults to false)
 */

/**
 * QuizUpdateModel - Data for updating a quiz
 * 
 * @typedef {Object} QuizUpdateModel
 * @property {string} [title] - Quiz title
 * @property {number} [totalQuestions] - Number of questions
 * @property {number} [passingScore] - Minimum passing score
 * @property {boolean} [isPublished] - Whether quiz is visible
 */

export const QuizModel = {};
