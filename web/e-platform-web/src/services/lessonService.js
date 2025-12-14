const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class LessonService {
  /**
   * Fetches all lessons for a specific course
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Array>} List of lessons
   */
  static async getLessonsByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/v1/lesson/course/${courseId}/list`);
    if (!res.ok) throw new Error('Failed to fetch lessons');
    return res.json();
  }

  /**
   * Fetches all lessons for a specific chapter
   * @param {string} chapterId - The ID of the chapter
   * @returns {Promise<Array>} List of lessons
   */
  static async getLessonsByChapter(chapterId) {
    const res = await fetch(`${API_URL}/api/v1/lesson/chapter/${chapterId}/list`);
    if (!res.ok) throw new Error('Failed to fetch lessons');
    return res.json();
  }

  /**
   * Fetches a specific lesson by ID
   * @param {string} lessonId - The ID of the lesson
   * @returns {Promise<Object>} Lesson data
   */
  static async getLessonById(lessonId) {
    const res = await fetch(`${API_URL}/api/v1/lesson/${lessonId}`);
    if (!res.ok) throw new Error('Failed to fetch lesson');
    return res.json();
  }

  /**
   * Creates a new lesson
   * @param {Object} lessonData - Lesson creation data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created lesson data
   */
  static async createLesson(lessonData, token) {
    const res = await fetch(`${API_URL}/api/v1/lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(lessonData),
    });
    if (!res.ok) throw new Error('Failed to create lesson');
    return res.json();
  }

  /**
   * Updates an existing lesson
   * @param {string} lessonId - The ID of the lesson to update
   * @param {Object} lessonData - Updated lesson data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated lesson data
   */
  static async updateLesson(lessonId, lessonData, token) {
    const res = await fetch(`${API_URL}/api/v1/lesson/${lessonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(lessonData),
    });
    if (!res.ok) throw new Error('Failed to update lesson');
    return res.json();
  }

  /**
   * Deletes a lesson
   * @param {string} lessonId - The ID of the lesson to delete
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteLesson(lessonId, token) {
    const res = await fetch(`${API_URL}/api/v1/lesson/${lessonId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete lesson');
    return res.json();
  }
}

export default LessonService;
