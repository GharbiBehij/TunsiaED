// src/modules/User/dao/User.dao.js
import { db } from '../../../config/firebase.js';

const COLLECTION = 'User';

export class UserDao {
  _getRoleFlags(data) {
    // If boolean flags provided explicitly, use them
    if (data.isAdmin === true || data.isInstructor === true || data.isStudent === true) {
      return {
        isAdmin: data.isAdmin === true,
        isInstructor: data.isInstructor === true,
        isStudent: data.isStudent === true,
      };
    }

    // If string role provided, convert to boolean flags
    if (data.role) {
      return {
        isAdmin: data.role === 'admin',
        isInstructor: data.role === 'instructor',
        isStudent: data.role === 'student',
      };
    }

    // Default: student
    return {
      isAdmin: false,
      isInstructor: false,
      isStudent: true,
    };
  }

  async create(uid, data) {
    const ref = db.collection(COLLECTION).doc(uid);
    const roleFlags = this._getRoleFlags(data);

    const profile = {
      uid,
      email: data.email,
      name: data.name || null,
      phone: data.phone || null,
      ...roleFlags,  // ← Only boolean flags, no string role
      birthDate: data.birthDate || null,
      birthPlace: data.birthPlace || null,
      level: data.level || null,
      bio: data.bio || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ref.set(profile, { merge: true });
    const doc = await ref.get();
    return doc.data();
  }

  async getByUid(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    return doc.exists ? doc.data() : null;
  }

  async update(uid, updates) {
    const ref = db.collection(COLLECTION).doc(uid);
    
    // Build update data
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    // If role-related fields provided, map them to boolean flags
    if (updates.role || updates.isAdmin !== undefined || updates.isInstructor !== undefined || updates.isStudent !== undefined) {
      const roleFlags = this._getRoleFlags(updates);
      Object.assign(updateData, roleFlags);
      delete updateData.role; // Remove string role if it exists
    }

    await ref.update(updateData);
    const doc = await ref.get();
    return doc.data();
  }

  async delete(uid) {
    const ref = db.collection(COLLECTION).doc(uid);
    await ref.delete();
    return { message: 'User deleted successfully' };
  }

  /**
   * Query methods for role-based filtering
   */
  async getAllAdmins() {
    const snapshot = await db.collection(COLLECTION)
      .where('isAdmin', '==', true)
      .get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getAllInstructors() {
    const snapshot = await db.collection(COLLECTION)
      .where('isInstructor', '==', true)
      .get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getAllStudents() {
    const snapshot = await db.collection(COLLECTION)
      .where('isStudent', '==', true)
      .get();
    return snapshot.docs.map(doc => doc.data());
  }
}

export const userDao = new UserDao();