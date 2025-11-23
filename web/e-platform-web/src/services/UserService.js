const BFF_BASE_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class UserService {
  static async getProfile(token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  }

  static async updateProfile(profileData, token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/user/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  static async deleteProfile(token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/user/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete profile');
    return res.json();
  }

  static async onboard(onboardData, token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/user/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(onboardData),
    });
    if (!res.ok) throw new Error('Failed to onboard user');
    return res.json();
  }
}

export default UserService;
