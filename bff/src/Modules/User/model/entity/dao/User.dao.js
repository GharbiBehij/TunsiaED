// src/modules/User/model/dao/User.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../../config/firebase.js';

const COLLECTION = 'User';

export class UserDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _getRoleFlags(data) {
    if (data.isAdmin === true || data.isInstructor === true || data.isStudent === true) {
      return {
        isAdmin: data.isAdmin === true,
        isInstructor: data.isInstructor === true,
        isStudent: data.isStudent === true,
      };
    }
    if (data.role) {
      return {
        isAdmin: data.role === 'admin',
        isInstructor: data.role === 'instructor',
        isStudent: data.role === 'student',
      };
    }
    return { isAdmin: false, isInstructor: false, isStudent: true };
  }

  async create(uid, data) {
    const ref = this.collection.doc(uid);
    const roleFlags = this._getRoleFlags(data);

    const profile = {
      uid,
      email: data.email,
      name: data.name || null,
      phone: data.phone || null,
      ...roleFlags,
      birthDate: data.birthDate || null,
      birthPlace: data.birthPlace || null,
      level: data.level || null,
      bio: data.bio || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ref.set(profile, { merge: true });
    const doc = await ref.get();
    return doc.exists ? doc.data() : null;
  }

  async getByUid(uid) {
    const doc = await this.collection.doc(uid).get();
    return doc.exists ? doc.data() : null;
  }

  async update(uid, updates) {
    const ref = this.collection.doc(uid);
    const updateData = { ...updates, updatedAt: new Date() };

    if (updates.role || updates.isAdmin !== undefined || updates.isInstructor !== undefined || updates.isStudent !== undefined) {
      const roleFlags = this._getRoleFlags(updates);
      Object.assign(updateData, roleFlags);
      delete updateData.role;
    }

    await ref.update(updateData);
    const doc = await ref.get();
    return doc.exists ? doc.data() : null;
  }

  async delete(uid) {
    await this.collection.doc(uid).delete();
    return { message: 'User deleted successfully' };
  }

  async getAllAdmins() {
    const snapshot = await this.collection.where('isAdmin', '==', true).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getAllInstructors() {
    const snapshot = await this.collection.where('isInstructor', '==', true).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getAllStudents() {
    const snapshot = await this.collection.where('isStudent', '==', true).get();
    return snapshot.docs.map(doc => doc.data());
  }
}

export const userDao = new UserDao();