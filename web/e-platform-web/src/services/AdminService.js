// src/services/AdminService.js
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class AdminService {
  static async getStats(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }

  static async getRevenueData(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/revenue`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch revenue');
    return res.json();
  }

  static async getRecentActivity(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/activity`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  }

  static async getCoursePerformance(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/courses/performance`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch course performance');
    return res.json();
  }

  static async getUserEngagement(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/engagement`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch user engagement');
    return res.json();
  }

  static async getActivePromotions(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/promotions/active`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch active promotions');
    return res.json();
  }

  static async getSubscriptionPlans(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/subscriptions/plans`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch subscription plans');
    return res.json();
  }

  static async getSubscriptionStats(token) {
    const res = await fetch(`${API_URL}/api/v1/admin/subscriptions/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch subscription stats');
    return res.json();
  }

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