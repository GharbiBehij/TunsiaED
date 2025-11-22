// src/modules/User/repository/User.repository.js
import { userDao } from '../model/dao/User.dao.js';

export class UserRepository {
  async onboard(uid, data) {
    return await userDao.create(uid, data);
  }

  async findByUid(uid) {
    return await userDao.getByUid(uid);
  }

  async updateProfile(uid, updates) {
    return await userDao.update(uid, updates);
  }
  async deleteProfile(uid){
    return await userDao.delete(uid);
  }
}

export const userRepository = new UserRepository();