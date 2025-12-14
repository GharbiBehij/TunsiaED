// web/src/services/UserService.js
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class UserService {
  /**
   * Onboards a new user with initial profile data
   * @param {string} token - Authentication token
   * @param {Object} data - User onboarding data
   * @returns {Promise<Object>} Onboarding confirmation
   */
  static async onboardUser(token, data) {
    const res = await fetch(`${API_URL}/api/v1/user/onboard`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to onboard user');
    return res.json();
  }

  /**
   * Fetches the authenticated user's profile
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} User profile data
   */
  static async getMyProfile(token) {
    const res = await fetch(`${API_URL}/api/v1/user/me`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }

  /**
   * Updates the authenticated user's profile
   * @param {string} token - Authentication token
   * @param {Object} data - Updated profile data
   * @returns {Promise<Object>} Updated profile data
   */
  static async updateProfile(token, data) {
    const res = await fetch(`${API_URL}/api/v1/user/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  /**
   * Deletes the authenticated user's profile
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteProfile(token) {
    const res = await fetch(`${API_URL}/api/v1/user/me`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete profile');
    return res.json();
  }
}

export default UserService;
