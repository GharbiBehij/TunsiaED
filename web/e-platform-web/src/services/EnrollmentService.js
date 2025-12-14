const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class EnrollmentService {
  /**
   * Enrolls a user in a course
   * @param {Object} enrollmentData - Enrollment data (courseId, etc.)
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Enrollment confirmation
   */
  static async enroll(enrollmentData, token) {
    const res = await fetch(`${API_URL}/api/v1/enrollment/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(enrollmentData),
    });
    if (!res.ok) throw new Error('Failed to enroll in course');
    return res.json();
  }

  /**
   * Fetches enrollments for the authenticated user
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of user's enrollments
   */
  static async getUserEnrollments(token) {
    const res = await fetch(`${API_URL}/api/v1/enrollment/my-enrollments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user enrollments');
    return res.json();
  }

  /**
   * Fetches a specific enrollment by ID
   * @param {string} enrollmentId - The ID of the enrollment
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Enrollment data
   */
  static async getEnrollmentById(enrollmentId, token) {
    const res = await fetch(`${API_URL}/api/v1/enrollment/${enrollmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch enrollment');
    return res.json();
  }

  /**
   * Fetches enrollment with detailed progress information
   * @param {string} enrollmentId - The ID of the enrollment
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Enrollment with progress data
   */
  static async getEnrollmentProgress(enrollmentId, token) {
    const res = await fetch(`${API_URL}/api/v1/enrollment/${enrollmentId}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch enrollment progress');
    return res.json();
  }

  /**
   * Fetches course enrollments with progress (for instructors)
   * @param {string} courseId - The course ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Enrollments with progress data
   */
  static async getCourseEnrollmentsWithProgress(courseId, token) {
    const res = await fetch(`${API_URL}/api/v1/enrollment/course/${courseId}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch course enrollments progress');
    return res.json();
  }
}

export default EnrollmentService;
