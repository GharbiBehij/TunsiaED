const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class ChapterService {
  /**
   * Fetches all chapters for a specific course
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Array>} List of chapters
   */
  static async getChaptersByCourse(courseId) {
    const res = await fetch(`${API_URL}/api/v1/chapter/course/${courseId}/list`);
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return res.json();
  }

  /**
   * Fetches a specific chapter by ID
   * @param {string} chapterId - The ID of the chapter
   * @returns {Promise<Object>} Chapter data
   */
  static async getChapterById(chapterId) {
    const res = await fetch(`${API_URL}/api/v1/chapter/${chapterId}`);
    if (!res.ok) throw new Error('Failed to fetch chapter');
    return res.json();
  }
}

export default ChapterService;
