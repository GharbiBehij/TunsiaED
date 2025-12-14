// src/modules/User/repository/User.repository.js
import { userDao } from '../model/entity/dao/User.dao.js';

export const userRepository = {
  // Create user profile via DAO
  async onboard(uid, data) {
    // DAO handles role mapping internally
    return await userDao.create(uid, data);
  },

  // Find a user by UID via DAO
  async findByUid(uid) {
    return await userDao.getByUid(uid);
  },

  // Update user profile via DAO
  async updateProfile(uid, updates) {
    return await userDao.update(uid, updates);
  },

  // Delete user profile via DAO
  async deleteProfile(uid) {
    return await userDao.delete(uid);
  },

  // Get all admin users via DAO
  async getAdmins() {
    return await userDao.getAllAdmins();
  },

  // Get all instructor users via DAO
  async getInstructors() {
    return await userDao.getAllInstructors();
  },

  // Get all student users via DAO
  async getStudents() {
    return await userDao.getAllStudents();
  },
};