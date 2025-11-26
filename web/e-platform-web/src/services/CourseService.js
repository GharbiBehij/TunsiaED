const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class CourseService {
  static async getAllCourses() {
    const res = await fetch(`${API_URL}/api/v1/course`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  }

  static async getCourseById(courseId) {
    const res = await fetch(`${API_URL}/api/v1/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  }

  static async getCoursesByCategory(category) {
    const res = await fetch(`${API_URL}/api/v1/course/category/${category}`);
    if (!res.ok) throw new Error('Failed to fetch courses by category');
    return res.json();
  }

  static async createCourse(courseData, token) {
    const res = await fetch(`${API_URL}/api/v1/course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  }

  static async updateCourse(courseId, courseData, token) {
    const res = await fetch(`${API_URL}/api/v1/course/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  }

  static async deleteCourse(courseId, token) {
    const res = await fetch(`${API_URL}/api/v1/course/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return res.json();
  }

  static async getInstructorCourses(token) {
    const res = await fetch(`${API_URL}/api/v1/course/instructor/my-courses`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch instructor courses');
    return res.json();
  }
}

export default CourseService;
