const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class StudentService {
  // ====================================================================
  // DIRECT SERVICE ENDPOINTS (single module operations)
  // These call the Student module directly without orchestration
  // ====================================================================

  /**
   * Fetches student dashboard statistics
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Student stats data
   */
  static async getStats(token) {
    const res = await fetch(`${API_URL}/api/v1/student/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student stats');
    return res.json();
  }

  /**
   * Fetches courses available to the student
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of available courses
   */
  static async getCourses(token) {
    const res = await fetch(`${API_URL}/api/v1/student/courses`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student courses');
    return res.json();
  }

  /**
   * Fetches student's enrollments
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of student's enrollments
   */
  static async getEnrollments(token) {
    const res = await fetch(`${API_URL}/api/v1/student/enrollments`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student enrollments');
    return res.json();
  }

  /**
   * Fetches student's certificates
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of certificates
   */
  static async getCertificates(token) {
    const res = await fetch(`${API_URL}/api/v1/student/certificates`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student certificates');
    return res.json();
  }

  /**
   * Fetches student's learning progress (basic)
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Progress data
   */
  static async getProgress(token) {
    const res = await fetch(`${API_URL}/api/v1/student/progress`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student progress');
    return res.json();
  }

  /**
   * Updates student's progress (basic)
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @param {Object} progressData - Progress data to update
   * @returns {Promise<Object>} Updated progress
   */
  static async updateProgress(token, progressData) {
    const res = await fetch(`${API_URL}/api/v1/student/progress`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(progressData),
    });
    if (!res.ok) throw new Error('Failed to update student progress');
    return res.json();
  }

  // ====================================================================
  // ORCHESTRATED ENDPOINTS (cross-module operations)
  // These use StudentDashboardOrchestrator for aggregated data
  // ====================================================================

  /**
   * Fetches complete student dashboard data (aggregated)
   * ORCHESTRATOR: Aggregates stats, courses, enrollments, certificates, progress
   * Cross-module: Student + Progress + Enrollment + Certificate modules
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { stats, courses, enrollments, certificates, progress }
   */
  static async getDashboard(token) {
    const res = await fetch(`${API_URL}/api/v1/student/dashboard`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch student dashboard');
    }
    return res.json();
  }

  /**
   * Fetches enrollments with detailed progress data
   * ORCHESTRATOR: Merges enrollment and progress data
   * Cross-module: Student + Progress modules
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Enrollments with progress details
   */
  static async getEnrollmentsWithProgress(token) {
    const res = await fetch(`${API_URL}/api/v1/student/enrollments/detailed`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch enrollments with progress');
    }
    return res.json();
  }

  /**
   * Fetches comprehensive learning overview
   * ORCHESTRATOR: Combines stats, progress, certificates for complete view
   * Cross-module: Student + Progress + Certificate modules
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { stats, progressSummary, recentCertificates, learningStreak }
   */
  static async getLearningOverview(token) {
    const res = await fetch(`${API_URL}/api/v1/student/learning/overview`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch learning overview');
    }
    return res.json();
  }

  /**
   * Updates progress with enrollment synchronization
   * ORCHESTRATOR: Updates progress and keeps enrollment in sync
   * Cross-module: Student + Progress + Enrollment modules
   * @param {string} token - Authentication token
   * @param {Object} progressData - { progressId, updateData }
   * @returns {Promise<Object>} Updated progress with enrollment status
   */
  static async updateProgressOrchestrated(token, progressData) {
    const res = await fetch(`${API_URL}/api/v1/student/progress/update`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(progressData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update progress');
    }
    return res.json();
  }

  /**
   * Fetches progress by enrollment ID
   * ORCHESTRATOR: Gets detailed progress for specific enrollment
   * Cross-module: Student + Progress modules
   * @param {string} token - Authentication token
   * @param {string} enrollmentId - The enrollment ID
   * @returns {Promise<Object>} Detailed progress for enrollment
   */
  static async getProgressByEnrollment(token, enrollmentId) {
    const res = await fetch(`${API_URL}/api/v1/student/progress/enrollment/${enrollmentId}`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch enrollment progress');
    }
    return res.json();
  }

  /**
   * Fetches progress by course ID
   * ORCHESTRATOR: Gets course-specific progress summary
   * Cross-module: Student + Progress modules
   * @param {string} token - Authentication token
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} Progress summary for course
   */
  static async getProgressByCourse(token, courseId) {
    const res = await fetch(`${API_URL}/api/v1/student/progress/course/${courseId}`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch course progress');
    }
    return res.json();
  }

  /**
   * Fetches overall progress overview
   * ORCHESTRATOR: Gets all courses progress summary
   * Cross-module: Student + Progress modules
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Overall progress overview
   */
  static async getProgressOverview(token) {
    const res = await fetch(`${API_URL}/api/v1/student/progress/overview`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch progress overview');
    }
    return res.json();
  }
}

export default StudentService;
