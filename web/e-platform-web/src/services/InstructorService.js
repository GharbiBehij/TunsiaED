// frontend/src/services/InstructorService.js
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class InstructorService {
  // ====================================================================
  // DIRECT SERVICE ENDPOINTS (single module operations)
  // These call the Instructor module directly without orchestration
  // ====================================================================

  /**
   * Fetches instructor dashboard statistics
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Instructor stats data
   */
  static async getStats(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch instructor stats');
    return res.json();
  }

  /**
   * Fetches list of courses created by the instructor
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of instructor's courses
   */
  static async getCourses(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/courses`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch instructor courses');
    return res.json();
  }

  /**
   * Fetches list of students enrolled in instructor's courses
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of enrolled students
   */
  static async getStudents(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/students`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch instructor students');
    return res.json();
  }

  /**
   * Fetches instructor's revenue data
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Revenue information
   */
  static async getRevenue(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/revenue`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch instructor revenue');
    return res.json();
  }

  /**
   * Fetches instructor's revenue trends over time
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Revenue trends data
   */
  static async getRevenueTrends(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/revenue-trends`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch revenue trends');
    return res.json();
  }

  /**
   * Fetches instructor's recent activity
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Recent activity logs
   */
  static async getRecentActivity(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/activity`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch recent activity');
    return res.json();
  }

  /**
   * Fetches performance metrics for instructor's courses
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Course performance data
   */
  static async getCoursePerformance(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/courses/performance`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch course performance');
    return res.json();
  }

  /**
   * Fetches student progress for a specific course (instructor view)
   * DIRECT: Uses Instructor module's own endpoint
   * @param {string} token - Authentication token
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} { progress: Array } - Student progress data
   */
  static async getStudentProgressForCourse(token, courseId) {
    const res = await fetch(`${API_URL}/api/v1/instructor/courses/${courseId}/students/progress`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) throw new Error('Failed to fetch student progress');
    return res.json();
  }
  /** * Fetches the instructor status for the authenticated user
   * DIRECT: Uses Instructor module's own endpoint
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { isInstructor: boolean, status: string }
   */
  static async getInstructorStatus(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/status`, { 
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch instructor status');
    return res.json();
  }
  // ====================================================================
  // ORCHESTRATED ENDPOINTS (cross-module operations)
  // These use InstructorDashboardOrchestrator for aggregated data
  // ====================================================================

  /**
   * Fetches complete instructor dashboard data (aggregated)
   * ORCHESTRATOR: Aggregates stats, revenue trends, activity, and course performance
   * Cross-module: Instructor + Progress modules
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { stats, revenueTrends, recentActivity, coursePerformance }
   */
  static async getDashboard(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/dashboard`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch instructor dashboard');
    }
    return res.json();
  }

  /**
   * Fetches instructor revenue overview (aggregated)
   * ORCHESTRATOR: Combines revenue data with trends
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { current, trends, summary }
   */
  static async getRevenueOverview(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/revenue/overview`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch revenue overview');
    }
    return res.json();
  }

  /**
   * Fetches course performance with detailed student progress
   * ORCHESTRATOR: Merges course performance with progress tracking
   * Cross-module: Instructor + Progress modules
   * @param {string} token - Authentication token
   * @param {string} [courseId] - Optional course ID for specific course
   * @returns {Promise<Object>} Course performance with student progress details
   */
  static async getCoursePerformanceWithProgress(token, courseId = null) {
    const url = courseId 
      ? `${API_URL}/api/v1/instructor/courses/performance/detailed?courseId=${courseId}`
      : `${API_URL}/api/v1/instructor/courses/performance/detailed`;
    const res = await fetch(url, { headers: getAuthHeaders(token) });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch course performance with progress');
    }
    return res.json();
  }
}

export default InstructorService;