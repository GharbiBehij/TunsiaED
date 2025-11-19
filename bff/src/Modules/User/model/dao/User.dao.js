// src/modules/User/dao/User.dao.js
import { auth, db } from '../../../../config/firebase.js';
//const userRaw= userDoc.data()
//data->DTO->waits for the creation of user through auth(firebase)
export class UserDao {
  async createFirebaseUser(data, hashedPassword) {
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,//firebase handles the hashing
      displayName: data.name,
    });

    const userDoc = {
      userId: userRecord.uid,
      email: userRecord.email || data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      role: data.role,
      createdAt: new Date(),
      hashedPassword,
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc);

    return { ...userDoc, userId: userRecord.uid };
  }

  async getUserDoc(uid) {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  }
}
export const userDao = new UserDao();