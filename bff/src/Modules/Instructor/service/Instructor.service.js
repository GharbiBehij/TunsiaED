// bff/src/Modules/Instructor/service/Instructor.service.js
// Single-module operations only. Cross-module progress operations are in InstructorDashboard.orchestrator.js
import { instructorRepository } from '../repository/Instructor.repository.js';
import { InstructorPermission } from './InstructorPermission.js';

export class InstructorService {
  // Get instructor's courses (admin/instructor only)
  async getCourses(user) {
    if (!InstructorPermission.getCourses(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorCourses(user.uid);
  }

  // Get instructor's enrolled students (admin/instructor only)
  async getStudents(user) {
    if (!InstructorPermission.getStudents(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorStudents(user.uid);
  }

  // Get instructor's revenue data (admin/instructor only)
  async getRevenue(user) {
    if (!InstructorPermission.getRevenue(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorRevenue(user.uid);
  }

  // Get instructor's course performance metrics (admin/instructor only)
  async getCoursePerformance(user) {
    if (!InstructorPermission.getCourses(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorCoursePerformance(user.uid);
  }

  // Get instructor's dashboard statistics (admin/instructor only)
  async getStats(user) {
    if (!InstructorPermission.getStats(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorStats(user.uid);
  }

  // Get instructor's revenue trends over time (admin/instructor only)
  async getRevenueTrends(user) {
    if (!InstructorPermission.getRevenue(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorRevenueTrends(user.uid);
  }

  // Get instructor's recent activity (admin/instructor only)
  async getRecentActivity(user, limit = 10) {
    if (!InstructorPermission.getActivity(user)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorActivity(user.uid, limit);
  }

  // Note: getStudentProgressForCourse is now in InstructorDashboard.orchestrator.js
  // as it crosses Progress + Course + User modules
}

export const instructorService = new InstructorService();

