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
}

export default AdminService;