// Service layer for certificate-related logic.
// Single-module operations only. Cross-module certificate granting is in CertificateGranting.orchestrator.js
import { certificateRepository } from '../repository/Certificate.repository.js';
import { CertificatePermission } from './CertificatePermission.js';
import { CertificateMapper } from '../mapper/Certificate.mapper.js';

export class CertificateService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? CertificateMapper.toModel(raw.certificateId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => CertificateMapper.toModel(raw.certificateId, raw));
  }

  _toEntity(courseId, model) {
    return CertificateMapper.toEntity(courseId, model);
  }

  _toEntityUpdate(model) {
    return CertificateMapper.toEntityUpdate(model);
  }

  // Issue a certificate (internal use - validation done by orchestrator)
  async issueCertificate(userId, courseId, data = {}) {
    const certificateData = {
      enrollmentId: data.enrollmentId,
      studentId: userId,
      ...data,
    };
    CertificateMapper.validateCreate(certificateData);
    const raw = await certificateRepository.createCertificate(userId, courseId, certificateData);
    return this._toModel(raw);
  }

  // Get a single certificate by ID (public/restricted)
  async getCertificateById(certificateId) {
    const raw = await certificateRepository.findByCertificateId(certificateId);
    return this._toModel(raw);
  }

  // Get all certificates for a user (admin/owner only)
  async getUserCertificates(userId) {
    const rawList = await certificateRepository.findCertificatesByUser(userId);
    return this._toModels(rawList);
  }

  // Get all certificates issued for a course
  async getCourseCertificates(courseId) {
    const rawList = await certificateRepository.findCertificatesByCourse(courseId);
    return this._toModels(rawList);
  }

  // Get all certificates (admin only)
  async getAllCertificates() {
    const rawList = await certificateRepository.findAllCertificates();
    return this._toModels(rawList);
  }

  // Update certificate details (admin only)
  async updateCertificate(certificateId, user, updates) {
    if (!CertificatePermission.update(user)) {
      throw new Error('Unauthorized');
    }
    const raw = await certificateRepository.updateCertificate(certificateId, updates);
    return this._toModel(raw);
  }

  // Revoke/delete a certificate (admin only)
  async revokeCertificate(certificateId, user) {
    if (!CertificatePermission.delete(user)) {
      throw new Error('Unauthorized');
    }
    return certificateRepository.deleteCertificate(certificateId);
  }
}
export const certificateService = new CertificateService();


