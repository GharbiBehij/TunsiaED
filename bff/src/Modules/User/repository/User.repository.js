// src/modules/User/repository/User.repository.js
import { auth } from '../../../config/firebase.js';
import { userDao } from '../model/dao/User.dao.js';
import { User } from '../model/entity/User.entity.js';

export class UserRepository {
  async createUser(data, hashedPassword) {
    const raw = await userDao.createFirebaseUser(data, hashedPassword);
    return new User(
      raw.userId,//we use raw for instant data(Auth),raw=now
      raw.email,
      raw.name,
      raw.photoURL,
      raw.role,
      new Date(),
      raw.hashedPassword
    );
  }
  async findByEmail(email) {
    try {
        const userRecord = await auth.getUserByEmail(email);//auth came from firebase.ts
        const doc = await userDao.getUserDoc(userRecord.uid);
        if (!doc) return null;

      return new User(
        doc.UserId,//doc= later
        doc.email,
        doc.name,
        doc.role,
        new Date(doc.createdAt),
        doc.hashedPassword// this from firestore, since we have documentation in firestore,thats why we use doc
      );
    } catch {
      return null;
    }
  }

  async findById(userId) {
    try {
      const doc = await userDao.getUserDoc(userId);
      if (!doc) return null;

      return new User(
        doc.userId,
        doc.email,
        doc.name,
        doc.photoURL,
        doc.role,
        new Date(doc.createdAt),
        doc.hashedPassword
      );
    } catch {
      return null;
    }
  }
  
}


export const userRepository = new UserRepository();