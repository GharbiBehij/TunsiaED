// src/modules/User/dao/User.dao.js
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'User';

export class UserDao {
  async create(uid, data) {
    const ref = db.collection(COLLECTION).doc(uid);
    await ref.set({
      uid,
      email: data.email,
      name: data.name || null,
      phone: data.phone || null,
      // Map role string to boolean fields
      // Default to student if no role specified
      role: data.role || 'student',
      isAdmin: data.role === 'admin' || data.isAdmin === true,
      isInstructor: data.role === 'instructor' || data.isInstructor === true,
      isStudent: data.role === 'student' || (!data.role && !data.isAdmin && !data.isInstructor) || data.isStudent === true,
      birthDate: data.birthDate || null,
      birthPlace: data.birthPlace || null,
      level: data.level || null,
      bio: data.bio || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    const doc = await ref.get();
    return doc.data();
  }

  async getByUid(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();//you access the collection.you put the field in the document.you put the action you want to make
    return doc.exists ? doc.data() : null;
  }

  async update(uid, updates) {
    const ref = db.collection(COLLECTION).doc(uid);
    
    // Handle role mapping if role is provided
    const updateData = { ...updates, updatedAt: new Date() };
    
    if (updates.role) {
      updateData.isAdmin = updates.role === 'admin' || updates.isAdmin === true;
      updateData.isInstructor = updates.role === 'instructor' || updates.isInstructor === true;
      updateData.isStudent = updates.role === 'student' || updates.isStudent === true;
    } else if (updates.isAdmin !== undefined || updates.isInstructor !== undefined || updates.isStudent !== undefined) {
      // If boolean fields are provided, update role accordingly
      if (updates.isAdmin === true) {
        updateData.role = 'admin';
        updateData.isInstructor = false;
        updateData.isStudent = false;
      } else if (updates.isInstructor === true) {
        updateData.role = 'instructor';
        updateData.isAdmin = false;
        updateData.isStudent = false;
      } else if (updates.isStudent === true) {
        updateData.role = 'student';
        updateData.isAdmin = false;
        updateData.isInstructor = false;
      }
    }
    
    await ref.update(updateData);
    const doc = await ref.get();
    return doc.data();
  }
  async delete(uid){
     const ref = db.collection(COLLECTION).doc(uid);
     await ref.delete();
     return { message: 'User deleted successfully' };
  }
}

export const userDao = new UserDao();