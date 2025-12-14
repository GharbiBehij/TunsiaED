// StudentRepository.js
import { studentDao } from '../model/dao/Student.dao.js';

export class StudentRepository {

  // ===============================
  // ENROLLMENTS
  // ===============================
  async getStudentEnrollments(studentId) {
    return await studentDao.getStudentEnrollments(studentId);
  }

  async findEnrollmentById(enrollmentId) {
    return await studentDao.findEnrollmentById(enrollmentId);
  }

  async updateEnrollmentProgress(enrollmentId, progressData) {
    return await studentDao.updateEnrollmentProgress(enrollmentId, progressData);
  }

  async markEnrollmentAsCompleted(enrollmentId) {
    return await studentDao.markEnrollmentAsCompleted(enrollmentId);
  }

  // ===============================
  // CERTIFICATES
  // ===============================
  async getStudentCertificates(studentId) {
    return await studentDao.getStudentCertificates(studentId);
  }

  // ===============================
  // STATS
  // ===============================
  async getStudentStats(studentId) {
    return await studentDao.getStudentStats(studentId);
  }
  async createCertificate(studentId) {
    return await studentDao.createCertificate(studentId);
}
  // ===============================
  // COURSES
  // ===============================
  async getCourseById(courseId) {
    return await studentDao.findCourseById(courseId);
  }

  // ===============================
  // PROGRESS / LESSON COMPLETION
  // ===============================
  async addCompletedLesson(enrollmentId, lessonId) {
    return await studentDao.addCompletedLesson(enrollmentId, lessonId);
  }
}

export const studentRepository = new StudentRepository();
