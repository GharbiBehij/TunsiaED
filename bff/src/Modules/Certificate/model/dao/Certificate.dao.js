// src/modules/Certificate/model/dao/Certificate.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Certificates';

export class CertificateDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { certificateId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ certificateId: doc.id, ...doc.data() }));
  }

  async createCertificate(courseId, data) {
    const docData = {
      enrollmentId: data.enrollmentId,
      studentId: data.studentId,
      courseId,
      issuedAt: data.issuedAt || new Date(),
      grade: data.grade ?? null,
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await this.collection.add(docData);
    return { certificateId: ref.id, ...docData };
  }

  async getCertificateById(certificateId) {
    const doc = await this.collection.doc(certificateId).get();
    return this._docToRaw(doc);
  }

  async updateCertificate(certificateId, data) {
    const update = { updatedAt: new Date() };
    if (data.grade !== undefined) update.grade = data.grade;
    if (data.metadata !== undefined) update.metadata = data.metadata;

    await this.collection.doc(certificateId).update(update);
    return this.getCertificateById(certificateId);
  }

  async deleteCertificate(certificateId) {
    await this.collection.doc(certificateId).delete();
  }

  async getCertificatesByUser(userId) {
    const snapshot = await this.collection
      .where('studentId', '==', userId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getCertificatesByCourse(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getAllCertificates() {
    const snapshot = await this.collection.get();
    return this._snapshotToRaw(snapshot);
  }
}

export const certificateDao = new CertificateDao();
