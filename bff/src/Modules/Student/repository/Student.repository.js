// Student Repository layer
import { studentDao } from '../model/dao/Student.dao.js';

export class StudentRepository {
  async getStudentEnrollments(studentId) {
    return await studentDao.getStudentEnrollments(studentId);
  }

  async getStudentProgress(studentId) {
    return await studentDao.getStudentProgress(studentId);
  }

  async getStudentCertificates(studentId) {
    return await studentDao.getStudentCertificates(studentId);
  }

  async getStudentStats(studentId) {
    return await studentDao.getStudentStats(studentId);
  }
  async updateEnrollmentProgress(enrollmentId, progress) {
    return await studentDao.updateEnrollmentProgress(enrollmentId, progress);
  }

// mark enrollment as completed by enrollment id
async markEnrollmentAsCompleted(enrollmentId) {
  return await studentDao.markEnrollmentAsCompleted(enrollmentId);
}
// find enrollment by enrollment id
async findEnrollmentById(enrollmentId) {
  return await studentDao.findEnrollmentById(enrollmentId);
}
}

export const studentRepository = new StudentRepository();
