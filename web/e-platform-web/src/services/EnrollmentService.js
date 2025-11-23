const BFF_BASE_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class EnrollmentService {
  static async enroll(enrollmentData, token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/enrollment/enroll`, {
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

  static async getUserEnrollments(token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/enrollment/my-enrollments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user enrollments');
    return res.json();
  }

  static async getEnrollmentById(enrollmentId, token) {
    const res = await fetch(`${BFF_BASE_URL}/api/v1/enrollment/${enrollmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch enrollment');
    return res.json();
  }
}

export default EnrollmentService;
