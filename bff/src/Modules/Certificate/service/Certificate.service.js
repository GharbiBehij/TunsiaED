// Service layer for certificate-related logic.
import { certificateRepository } from '../repository/Certificate.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { enrollmentRepository } from '../../Enrollement/Repository/Enrollement.repository.js';
import { canUpdateCertificate, canRevokeCertificate } from './CertificatePermission.js';

export class CertificateService {
  async issueCertificate(userId, courseId, data = {}) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) throw new Error('Course not found');

    // Basic check: user must be enrolled in the course
    const enrollments = await enrollmentRepository.findUserEnrollments(userId);
    const isEnrolled = enrollments.some(e => e.courseId === courseId);
    if (!isEnrolled) {
      throw new Error('User is not enrolled in this course');
    }

    return certificateRepository.createCertificate(userId, courseId, data);
  }

  async getCertificateById(certificateId) {
    return certificateRepository.findByCertificateId(certificateId);
  }

  async getUserCertificates(userId) {
    return certificateRepository.findCertificatesByUser(userId);
  }

  async getCourseCertificates(courseId) {
    return certificateRepository.findCertificatesByCourse(courseId);
  }

  async getAllCertificates() {
    return certificateRepository.findAllCertificates();
  }

  async updateCertificate(certificateId, user, updates) {
    if (!canUpdateCertificate(user)) {
      throw new Error('Unauthorized');
    }
    return certificateRepository.updateCertificate(certificateId, updates);
  }

  async revokeCertificate(certificateId, user) {
    if (!canRevokeCertificate(user)) {
      throw new Error('Unauthorized');
    }
    return certificateRepository.deleteCertificate(certificateId);
  }
}

export const certificateService = new CertificateService();


