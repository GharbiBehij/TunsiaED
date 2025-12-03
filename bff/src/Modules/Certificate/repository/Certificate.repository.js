// Repository for Certificate domain logic.
import { certificateDao } from '../model/dao/Certificate.dao.js';

export class CertificateRepository {
  // Create certificate via DAO
  async createCertificate(userId, courseId, data) {
    return await certificateDao.createCertificate(userId, courseId, data);
  }

  // Find a certificate by ID via DAO
  async findByCertificateId(certificateId) {
    try {
      const doc = await certificateDao.getCertificateById(certificateId);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Update certificate via DAO
  async updateCertificate(certificateId, data) {
    try {
      const doc = await certificateDao.updateCertificate(certificateId, data);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Delete certificate via DAO
  async deleteCertificate(certificateId) {
    try {
      await certificateDao.deleteCertificate(certificateId);
      return true;
    } catch {
      return false;
    }
  }

  // Find all certificates by user via DAO
  async findCertificatesByUser(userId) {
    try {
      const docs = await certificateDao.getCertificatesByUser(userId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all certificates by course via DAO
  async findCertificatesByCourse(courseId) {
    try {
      const docs = await certificateDao.getCertificatesByCourse(courseId);
      return docs
    } catch {
      return [];
    }
  }

  // Find all certificates via DAO
  async findAllCertificates() {
    try {
      const docs = await certificateDao.getAllCertificates();
      return docs
    } catch {
      return [];
    }
  }
}

export const certificateRepository = new CertificateRepository();


