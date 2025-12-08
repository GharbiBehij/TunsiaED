// src/services/AdminService.js
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class AdminService {
  /**
   * Fetches admin dashboard statistics
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Admin stats data
   */
  static async getStats(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }

  /**
   * Fetches revenue analytics data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Revenue data
   */
  static async getRevenueData(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/revenue`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch revenue');
    return res.json();
  }

  /**
   * Fetches recent platform activity
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Recent activity logs
   */
  static async getRecentActivity(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/activity`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  }

  /**
   * Fetches course performance metrics
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} Course performance data
   */
  static async getCoursePerformance(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/courses/performance`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch course performance');
    return res.json();
  }

  /**
   * Fetches user engagement metrics
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} User engagement data
   */
  static async getUserEngagement(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/engagement`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch user engagement');
    return res.json();
  }

  /**
   * Fetches active promotions
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of active promotions
   */
  static async getActivePromotions(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/promotions/active`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch active promotions');
    return res.json();
  }

  /**
   * Fetches subscription plans
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of subscription plans
   */
  static async getSubscriptionPlans(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/subscriptions/plans`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch subscription plans');
    return res.json();
  }

  /**
   * Fetches subscription statistics
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Subscription stats
   */
  static async getSubscriptionStats(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/subscriptions/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch subscription stats');
    return res.json();
  }

  /**
   * Updates a subscription plan
   * @param {string} token - Authentication token
   * @param {string} planId - ID of the plan to update
   * @param {Object} data - Updated plan data
   * @returns {Promise<Object>} Updated plan data
   */
  static async updateSubscriptionPlan(token, planId, data) {
    const res = await fetch(`${API_URL}/api/v1/admin/subscriptions/${planId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update subscription plan');
    return res.json();
  }

  /**
   * Creates a new promotion
   * @param {string} token - Authentication token
   * @param {Object} data - Promotion data
   * @returns {Promise<Object>} Created promotion data
   */
  static async createPromotion(token, data) {
    const res = await fetch(`${API_URL}/api/v1/admin/promotions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create promotion');
    return res.json();
  }

  /**
   * Get all users (admin only)
   * @param {string} token - Authentication token
   * @param {Object} options - Query options (page, limit, role)
   * @returns {Promise<Array>} List of users
   */
  static async getAllUsers(token, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.role) params.append('role', options.role);
    
    const res = await fetch(`${API_URL}/api/v1/admin/users?${params}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  }

  /**
   * Ban user (admin only)
   * @param {string} token - Authentication token
   * @param {string} userId - User ID to ban
   * @returns {Promise<Object>} Result message
   */
  static async banUser(token, userId) {
    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/ban`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to ban user');
    return res.json();
  }

  /**
   * Unban user (admin only)
   * @param {string} token - Authentication token
   * @param {string} userId - User ID to unban
   * @returns {Promise<Object>} Result message
   */
  static async unbanUser(token, userId) {
    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/unban`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to unban user');
    return res.json();
  }

  /**
   * Approve instructor application (admin only)
   * @param {string} token - Authentication token
   * @param {string} userId - User ID to approve as instructor
   * @returns {Promise<Object>} Result message
   */
  static async approveInstructor(token, userId) {
    const res = await fetch(`${API_URL}/api/v1/admin/instructors/${userId}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to approve instructor');
    return res.json();
  }

  /**
   * Decline instructor application (admin only)
   * @param {string} token - Authentication token
   * @param {string} userId - User ID to decline
   * @param {string} reason - Decline reason
   * @returns {Promise<Object>} Result message
   */
  static async declineInstructor(token, userId, reason) {
    const res = await fetch(`${API_URL}/api/v1/admin/instructors/${userId}/decline`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to decline instructor');
    return res.json();
  }

  /**
   * Get all courses (admin only)
   * @param {string} token - Authentication token
   * @param {Object} options - Query options (page, limit, status)
   * @returns {Promise<Array>} List of courses
   */
  static async getAllCourses(token, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.status) params.append('status', options.status);
    
    const res = await fetch(`${API_URL}/api/v1/admin/courses?${params}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }

  /**
   * Approve course (admin only)
   * @param {string} token - Authentication token
   * @param {string} courseId - Course ID to approve
   * @returns {Promise<Object>} Result message
   */
  static async approveCourse(token, courseId) {
    const res = await fetch(`${API_URL}/api/v1/admin/courses/${courseId}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to approve course');
    return res.json();
  }

  /**
   * Reject course (admin only)
   * @param {string} token - Authentication token
   * @param {string} courseId - Course ID to reject
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Result message
   */
  static async rejectCourse(token, courseId, reason) {
    const res = await fetch(`${API_URL}/api/v1/admin/courses/${courseId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to reject course');
    return res.json();
  }
}

export default AdminService;