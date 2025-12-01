// Instructor Service layer
import { instructorRepository } from '../repository/Instructor.repository.js';
import { InstructorPermission } from './InstructorPermission.js';

export class InstructorService {
  async getMyCourses(user) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorCourses(user.uid);
  }

  async getMyStudents(user) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorStudents(user.uid);
  }

  async getMyRevenue(user) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorRevenue(user.uid);
  }

  async getMyCoursePerformance(user) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorCoursePerformance(user.uid);
  }

  async getStats(user) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorStats(user.uid);
  }

  async getRevenueTrends(user) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorRevenueTrends(user.uid);
  }

  async getRecentActivity(user, limit) {
    if (!InstructorPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await instructorRepository.getInstructorActivity(user.uid, limit);
  }
}

export const instructorService = new InstructorService();

