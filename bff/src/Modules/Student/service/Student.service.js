// Student Service layer
import { studentRepository } from '../repository/Student.repository.js';
import { StudentPermission } from './StudentPermission.js';

export class StudentService {
  async getMyEnrollments(user) {
    if (!StudentPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentEnrollments(user.uid);
  }

  async getMyProgress(user) {
    if (!StudentPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentProgress(user.uid);
  }

  async getMyCertificates(user) {
    if (!StudentPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentCertificates(user.uid);
  }

  async getMyStats(user) {
    if (!StudentPermission.read(user, user.uid)) {
      throw new Error('Unauthorized');
    }
    return await studentRepository.getStudentStats(user.uid);
  }

  async getMyCourses(user) {
    if (!StudentPermission.read(user, user.uid)) {
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
  // update enrollment progress by enrollment id
async updateProgress(userId, enrollmentId, progress) {
  if (!StudentPermission.write(user, userId)) {
    throw new Error('Unauthorized');
  }
  if (progress < 0 || progress > 100) {
    throw new Error('Invalid progress value');
  }
  return await studentRepository.updateEnrollmentProgress(enrollmentId, progress);
}

async markCourseCompleted(userId, enrollmentId) {
  if (!StudentPermission.write(user, userId)) {
    throw new Error('Unauthorized');
  }
  const enrollment = await studentRepository.findEnrollmentById(enrollmentId);
  if (!enrollment || enrollment.userId !== userId) {
    throw new Error('Enrollment not found');
  }
  if (enrollment.progress < 100) {
    throw new Error('Course not completed yet');
  }
  return await studentRepository.markAsCompleted(enrollmentId);
}
  }


export const studentService = new StudentService();

