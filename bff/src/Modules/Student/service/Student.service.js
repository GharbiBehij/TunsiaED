// bff/src/Modules/Student/service/Student.service.js
// Single-module operations only. Cross-module progress operations are in StudentDashboard.orchestrator.js
import { studentRepository } from '../repository/Student.repository.js';
import { StudentPermission } from './StudentPermission.js';

export class StudentService {
  // Get student's course enrollments (admin/student only)
  async getEnrollments(user) {
    if (!StudentPermission.getEnrollments(user)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentEnrollments(user.uid);
  }

  // Get student's earned certificates (admin/student only)
  async getCertificates(user) {
    if (!StudentPermission.getCertificates(user)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentCertificates(user.uid);
  }

  // Get student's dashboard statistics (admin/student only)
  async getStats(user) {
    if (!StudentPermission.getStats(user)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentStats(user.uid);
  }

  // Get student's enrolled courses (admin/student only)
  async getCourses(user) {
    if (!StudentPermission.getCourses(user)) {
      throw new Error('Unauthorized');
    }
    const enrollments = await studentRepository.getStudentEnrollments(user.uid);
    return enrollments.map(e => e.course || { 
      courseId: e.courseId, 
      title: e.courseTitle,
      progress: e.progress,
      completed: e.completed 
    });
  }

  // Note: Progress operations (getProgress, updateProgress, completeLesson)
  // are now in StudentDashboard.orchestrator.js as they cross Progress + Enrollment modules
}

export const studentService = new StudentService();

