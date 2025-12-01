// frontend/src/services/InstructorService.js
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class InstructorService {
  static async getStats(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch instructor stats');
    return res.json();
  }
  static async getRevenueTrends(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/revenue-trends`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch revenue trends');
    return res.json();
  }
  static async getRecentActivity(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/activity`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch recent activity');
    return res.json();
  }
  static async getCoursePerformance(token) {
    const res = await fetch(`${API_URL}/api/v1/instructor/courses/performance`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch course performance');
    return res.json();
  }
}

export default InstructorService;