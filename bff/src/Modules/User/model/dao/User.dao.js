// src/modules/User/dao/User.dao.js
import { db } from '../../../config/firebase.js';

const COLLECTION = 'users';

export class UserDao {
  async create(uid, data) {
    const ref = db.collection('users').doc(uid);
    await ref.set({
      uid,
      email: data.email,
      name: data.name || null,
      phone: data.phone || null,
      role: data.role || 'student',
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
    await ref.update({ ...updates, updatedAt: new Date() });
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