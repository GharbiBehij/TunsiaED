const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class CourseService {
  /**
   * Fetches all available courses
   * @returns {Promise<Array>} List of all courses
   */
  static async getAllCourses() {
    const res = await fetch(`${API_URL}/api/v1/course`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }

  /**
   * Fetches a specific course by ID
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Object>} Course data
   */
  static async getCourseById(courseId) {
    const res = await fetch(`${API_URL}/api/v1/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  }

  /**
   * Fetches courses by category
   * @param {string} category - The category name
   * @returns {Promise<Array>} List of courses in the category
   */
  static async getCoursesByCategory(category) {
    const res = await fetch(`${API_URL}/api/v1/course/category/${category}`);
    if (!res.ok) throw new Error('Failed to fetch courses by category');
    return res.json();
  }

  /**
   * Fetches system courses (platform-seeded courses)
   * @returns {Promise<Array>} List of system courses
   */
  static async getSystemCourses() {
    const res = await fetch(`${API_URL}/api/v1/course/system`);
    if (!res.ok) throw new Error('Failed to fetch system courses');
    return res.json();
  }

  /**
   * Fetches all unique course categories
   * @returns {Promise<Array>} List of category names
   */
  static async getAllCategories() {
    const res = await fetch(`${API_URL}/api/v1/course/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }

  /**
   * Creates a new course
   * @param {Object} courseData - Course creation data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created course data
   */
  static async createCourse(courseData, token) {
    const res = await fetch(`${API_URL}/api/v1/course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  }

  /**
   * Updates an existing course
   * @param {string} courseId - The ID of the course to update
   * @param {Object} courseData - Updated course data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated course data
   */
  static async updateCourse(courseId, courseData, token) {
    const res = await fetch(`${API_URL}/api/v1/course/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  }

  /**
   * Deletes a course
   * @param {string} courseId - The ID of the course to delete
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteCourse(courseId, token) {
    const res = await fetch(`${API_URL}/api/v1/course/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return res.json();
  }

  /**
   * Fetches courses created by the authenticated instructor
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of instructor's courses
   */
  static async getInstructorCourses(token) {
    const res = await fetch(`${API_URL}/api/v1/course/instructor/my-courses`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch instructor courses');
    return res.json();
  }
}

export default CourseService;
