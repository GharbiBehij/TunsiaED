// Instructor Repository layer
import { instructorDao } from '../model/dao/Instructor.dao.js';

export class InstructorRepository {
  async getInstructorCourses(instructorId) {
    return await instructorDao.getInstructorCourses(instructorId);
  }

  async getInstructorStudents(instructorId) {
    return await instructorDao.getInstructorStudents(instructorId);
  }

  async getInstructorRevenue(instructorId) {
    return await instructorDao.getInstructorRevenue(instructorId);
  }

  async getInstructorCoursePerformance(instructorId) {
    return await instructorDao.getInstructorCoursePerformance(instructorId);
  }

  async getInstructorStats(instructorId) {
    return await instructorDao.getInstructorStats(instructorId);
  }

  async getInstructorRevenueTrends(instructorId) {
    return await instructorDao.getInstructorRevenueTrends(instructorId);
  }

  async getInstructorActivity(instructorId, limit) {
    return await instructorDao.getInstructorActivity(instructorId, limit);
  }

  /**
   * Get student progress for a course (instructor view)
   * @param {string} instructorId - The instructor ID
   * @param {string} courseId - The course ID
   */
  async getStudentProgressForCourse(instructorId, courseId) {
    return await instructorDao.getStudentProgressForCourse(instructorId, courseId);
  }
}

export const instructorRepository = new InstructorRepository();

