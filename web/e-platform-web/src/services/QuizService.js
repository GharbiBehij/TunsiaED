const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class QuizService {
  /**
   * Fetches all quizzes
   * @returns {Promise<Array>} List of all quizzes
   */
  static async getAllQuizzes() {
    const res = await fetch(`${API_URL}/api/v1/quiz`);
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
  }

  /**
   * Fetches a specific quiz by ID
   * @param {string} quizId - The ID of the quiz
   * @returns {Promise<Object>} Quiz data
   */
  static async getQuizById(quizId) {
    const res = await fetch(`${API_URL}/api/v1/quiz/${quizId}`);
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
  }

  /**
   * Fetches quizzes for a specific course
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Array>} List of quizzes for the course
   */
  static async getQuizzesByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/v1/quiz/course/${courseId}/list`);
    if (!res.ok) throw new Error('Failed to fetch course quizzes');
    return res.json();
  }

  /**
   * Fetches quizzes for a specific lesson
   * @param {string} lessonId - The ID of the lesson
   * @returns {Promise<Array>} List of quizzes for the lesson
   */
  static async getQuizzesByLesson(lessonId) {
    const res = await fetch(`${API_URL}/api/v1/quiz/lesson/${lessonId}/list`);
    if (!res.ok) throw new Error('Failed to fetch lesson quizzes');
    return res.json();
  }

  /**
   * Creates a new quiz
   * @param {Object} quizData - Quiz creation data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created quiz data
   */
  static async createQuiz(quizData, token) {
    const res = await fetch(`${API_URL}/api/v1/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(quizData),
    });
    if (!res.ok) throw new Error('Failed to create quiz');
    return res.json();
  }

  /**
   * Updates an existing quiz
   * @param {string} quizId - The ID of the quiz to update
   * @param {Object} quizData - Updated quiz data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated quiz data
   */
  static async updateQuiz(quizId, quizData, token) {
    const res = await fetch(`${API_URL}/api/v1/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(quizData),
    });
    if (!res.ok) throw new Error('Failed to update quiz');
    return res.json();
  }

  /**
   * Deletes a quiz
   * @param {string} quizId - The ID of the quiz to delete
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteQuiz(quizId, token) {
    const res = await fetch(`${API_URL}/api/v1/quiz/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete quiz');
    return res.json();
  }
}

export default QuizService;