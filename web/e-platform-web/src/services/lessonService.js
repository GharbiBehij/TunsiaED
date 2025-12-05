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
}

export default LessonService;
