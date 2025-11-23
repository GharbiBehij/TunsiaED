// src/modules/User/repository/User.repository.js
import { userDao } from '../model/dao/User.dao.js';

export const userRepository = {
  async onboard(uid, data) {
    // DAO handles role mapping internally
    return await userDao.create(uid, data);
  },

  async findByUid(uid) {
    return await userDao.getByUid(uid);
  },

  async updateProfile(uid, updates) {
    return await userDao.update(uid, updates);
  },

  async deleteProfile(uid) {
    return await userDao.delete(uid);
  },

  async getAdmins() {
    return await userDao.getAllAdmins();
  },

  async getInstructors() {
    return await userDao.getAllInstructors();
  },

  async getStudents() {
    return await userDao.getAllStudents();
  },
};