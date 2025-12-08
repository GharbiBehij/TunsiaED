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

  /**
   * Creates a new chapter
   * @param {Object} chapterData - Chapter creation data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created chapter data
   */
  static async createChapter(chapterData, token) {
    const res = await fetch(`${API_URL}/api/v1/chapter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chapterData),
    });
    if (!res.ok) throw new Error('Failed to create chapter');
    return res.json();
  }

  /**
   * Updates an existing chapter
   * @param {string} chapterId - The ID of the chapter to update
   * @param {Object} chapterData - Updated chapter data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated chapter data
   */
  static async updateChapter(chapterId, chapterData, token) {
    const res = await fetch(`${API_URL}/api/v1/chapter/${chapterId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chapterData),
    });
    if (!res.ok) throw new Error('Failed to update chapter');
    return res.json();
  }

  /**
   * Deletes a chapter
   * @param {string} chapterId - The ID of the chapter to delete
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteChapter(chapterId, token) {
    const res = await fetch(`${API_URL}/api/v1/chapter/${chapterId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete chapter');
    return res.json();
  }
}

export default ChapterService;
