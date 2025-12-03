const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Progress Service - Handles all progress tracking operations
 * Maps to /api/v1/progress endpoints in the backend
 */
class ProgressService {
  /**
   * Get or create progress for a module
   * @param {string} token - Authentication token
   * @param {Object} data - { enrollmentId, moduleType, moduleId, totalItems }
   * @returns {Promise<Object>} Progress data
   */
  static async getOrCreateProgress(token, data) {
    const res = await fetch(`${API_URL}/api/v1/progress`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to get or create progress');
    return res.json();
  }

  /**
   * Get all progress for the authenticated user
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { progress: Array } - List of progress records
   */
  static async getMyProgress(token) {
    const res = await fetch(`${API_URL}/api/v1/progress/my-progress`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  }

  /**
   * Get progress by ID
   * @param {string} token - Authentication token
   * @param {string} progressId - The progress ID
   * @returns {Promise<Object>} Progress data
   */
  static async getProgressById(token, progressId) {
    const res = await fetch(`${API_URL}/api/v1/progress/${progressId}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  }

  /**
   * Get all progress records for an enrollment
   * @param {string} token - Authentication token
   * @param {string} enrollmentId - The enrollment ID
   * @returns {Promise<Object>} { progress: Array } - List of progress records
   */
  static async getProgressByEnrollment(token, enrollmentId) {
    const res = await fetch(`${API_URL}/api/v1/progress/enrollment/${enrollmentId}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch enrollment progress');
    return res.json();
  }

  /**
   * Get user's progress summary for a specific course
   * @param {string} token - Authentication token
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} Progress summary data
   */
  static async getUserCourseProgressSummary(token, courseId) {
    const res = await fetch(`${API_URL}/api/v1/progress/course/${courseId}/summary`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch course progress summary');
    return res.json();
  }

  /**
   * Update progress
   * @param {string} token - Authentication token
   * @param {string} progressId - The progress ID
   * @param {Object} updateData - Data to update (progress, completedItems, etc.)
   * @returns {Promise<Object>} Updated progress data
   */
  static async updateProgress(token, progressId, updateData) {
    const res = await fetch(`${API_URL}/api/v1/progress/${progressId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  }

  /**
   * Mark an item as completed
   * @param {string} token - Authentication token
   * @param {string} progressId - The progress ID
   * @param {string} itemId - The item ID to mark as completed
   * @returns {Promise<Object>} Updated progress data
   */
  static async markItemCompleted(token, progressId, itemId) {
    const res = await fetch(`${API_URL}/api/v1/progress/${progressId}/complete-item`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ itemId }),
    });
    if (!res.ok) throw new Error('Failed to mark item completed');
    return res.json();
  }

  /**
   * Get progress for a specific module (instructor view)
   * @param {string} token - Authentication token
   * @param {string} moduleType - The module type (course, quiz, lesson, chapter)
   * @param {string} moduleId - The module ID
   * @returns {Promise<Object>} { progress: Array } - List of progress records
   */
  static async getProgressByModule(token, moduleType, moduleId) {
    const res = await fetch(`${API_URL}/api/v1/progress/module/${moduleType}/${moduleId}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch module progress');
    return res.json();
  }

  /**
   * Delete progress (admin only)
   * @param {string} token - Authentication token
   * @param {string} progressId - The progress ID
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteProgress(token, progressId) {
    const res = await fetch(`${API_URL}/api/v1/progress/${progressId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete progress');
    return res.json();
  }
}

export default ProgressService;
