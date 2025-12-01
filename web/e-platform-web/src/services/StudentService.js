const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class StudentService {
  static async getStats(token) {
    const res = await fetch(`${API_URL}/api/v1/student/stats`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student stats');
    return res.json();
  }
  static async getCourses(token) {
    const res = await fetch(`${API_URL}/api/v1/student/courses`, { headers: getAuthHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch student courses');
    return res.json();
  }
}

export default StudentService;
