// Firestore DAO for certificates.
import { db } from '../../../../config/firebase.js';

export class CertificateDao {
  async createCertificate(userId, courseId, data) {
    const docData = {
      userId,
      courseId,
      issuedAt: data.issuedAt || new Date(),
      grade: data.grade ?? null,
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await db.collection('Certificates').add(docData);
    return {
      certificateId: ref.id,
      ...docData,
    };
  }

  async getCertificateById(certificateId) {
    const snap = await db.collection('Certificates').doc(certificateId).get();
    return snap.exists ? snap.data() : null;
  }

  async updateCertificate(certificateId, data) {
    const update = {
      updatedAt: new Date(),
    };

    if (data.grade !== undefined) update.grade = data.grade;
    if (data.metadata !== undefined) update.metadata = data.metadata;

    await db.collection('Certificates').doc(certificateId).update(update);
    const snap = await db.collection('Certificates').doc(certificateId).get();
    return snap.exists ? snap.data() : null;
  }

  async deleteCertificate(certificateId) {
    await db.collection('Certificates').doc(certificateId).delete();
  }

  async getCertificatesByUser(userId) {
    const snapshot = await db
      .collection('Certificates')
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map(doc => ({
      certificateId: doc.id,
      ...doc.data(),
    }));
  }

  async getCertificatesByCourse(courseId) {
    const snapshot = await db
      .collection('Certificates')
      .where('courseId', '==', courseId)
      .get();

    return snapshot.docs.map(doc => ({
      certificateId: doc.id,
      ...doc.data(),
    }));
  }

  async getAllCertificates() {
    const snapshot = await db.collection('Certificates').get();
    return snapshot.docs.map(doc => ({
      certificateId: doc.id,
      ...doc.data(),
    }));
  }
}

export const certificateDao = new CertificateDao();


