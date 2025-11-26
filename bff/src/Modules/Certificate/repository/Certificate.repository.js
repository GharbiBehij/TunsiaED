// Repository for Certificate domain logic.
import { certificateDao } from '../model/dao/Certificate.dao.js';
import { Certificate } from '../model/entity/Certificate.entity.js';

export class CertificateRepository {
  async createCertificate(userId, courseId, data) {
    const raw = await certificateDao.createCertificate(userId, courseId, data);
    return new Certificate(
      raw.certificateId,
      raw.userId,
      raw.courseId,
      new Date(raw.issuedAt),
      raw.grade,
      raw.metadata,
      raw
    );
  }

  async findByCertificateId(certificateId) {
    try {
      const doc = await certificateDao.getCertificateById(certificateId);
      if (!doc) return null;
      return new Certificate(
        certificateId,
        doc.userId,
        doc.courseId,
        new Date(doc.issuedAt),
        doc.grade,
        doc.metadata,
        doc
      );
    } catch {
      return null;
    }
  }

  async updateCertificate(certificateId, data) {
    try {
      const doc = await certificateDao.updateCertificate(certificateId, data);
      if (!doc) return null;
      return new Certificate(
        certificateId,
        doc.userId,
        doc.courseId,
        new Date(doc.issuedAt),
        doc.grade,
        doc.metadata,
        doc
      );
    } catch {
      return null;
    }
  }

  async deleteCertificate(certificateId) {
    try {
      await certificateDao.deleteCertificate(certificateId);
      return true;
    } catch {
      return false;
    }
  }

  async findCertificatesByUser(userId) {
    try {
      const docs = await certificateDao.getCertificatesByUser(userId);
      return docs.map(doc =>
        new Certificate(
          doc.certificateId,
          doc.userId,
          doc.courseId,
          new Date(doc.issuedAt),
          doc.grade,
          doc.metadata,
          doc
        )
      );
    } catch {
      return [];
    }
  }

  async findCertificatesByCourse(courseId) {
    try {
      const docs = await certificateDao.getCertificatesByCourse(courseId);
      return docs.map(doc =>
        new Certificate(
          doc.certificateId,
          doc.userId,
          doc.courseId,
          new Date(doc.issuedAt),
          doc.grade,
          doc.metadata,
          doc
        )
      );
    } catch {
      return [];
    }
  }

  async findAllCertificates() {
    try {
      const docs = await certificateDao.getAllCertificates();
      return docs.map(doc =>
        new Certificate(
          doc.certificateId,
          doc.userId,
          doc.courseId,
          new Date(doc.issuedAt),
          doc.grade,
          doc.metadata,
          doc
        )
      );
    } catch {
      return [];
    }
  }
}

export const certificateRepository = new CertificateRepository();


