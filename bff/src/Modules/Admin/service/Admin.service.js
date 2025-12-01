// Admin Service layer
import { adminRepository } from '../repository/Admin.repository.js';
import { AdminPermission } from './AdminPermission.js';

export class AdminService {
  async getStats(user) {
    if (!AdminPermission.read(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getStats();
  }

  async getRevenue(user) {
    if (!AdminPermission.read(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getRevenue();
  }

  async getRecentActivity(user, limit = 10) {
    if (!AdminPermission.read(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getRecentActivity(limit);
  }

  async getCoursePerformance(user) {
    if (!AdminPermission.read(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getCoursePerformance();
  }

  async getUserEngagement(user) {
    if (!AdminPermission.read(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getUserEngagement();
  }
}

export const adminService = new AdminService();

