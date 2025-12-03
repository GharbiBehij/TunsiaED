// bff/src/Modules/Admin/service/Admin.service.js
import { adminRepository } from '../repository/Admin.repository.js';
import { AdminPermission } from './AdminPermission.js';

export class AdminService {
  // Get dashboard statistics (admin only)
  async getStats(user) {
    if (!AdminPermission.getStats(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getStats();
  }

  // Get revenue analytics (admin only)
  async getRevenue(user) {
    if (!AdminPermission.getRevenue(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getRevenue();
  }

  // Get recent platform activity (admin only)
  async getRecentActivity(user, limit = 10) {
    if (!AdminPermission.getActivity(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getRecentActivity(limit);
  }

  // Get course performance metrics (admin only)
  async getCoursePerformance(user) {
    if (!AdminPermission.getCoursePerformance(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getCoursePerformance();
  }

  // Get user engagement metrics (admin only)
  async getUserEngagement(user) {
    if (!AdminPermission.getUserEngagement(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getUserEngagement();
  }

  // Get active promotions (admin only)
  async getActivePromotions(user) {
    if (!AdminPermission.getPromotions(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getActivePromotions();
  }

  // Create new promotion (admin only)
  async createPromotion(user, promotionData) {
    if (!AdminPermission.managePromotions(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.createPromotion(promotionData);
  }

  // Get subscription plans (admin only)
  async getSubscriptionPlans(user) {
    if (!AdminPermission.getSubscriptions(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getSubscriptionPlans();
  }

  // Get subscription statistics (admin only)
  async getSubscriptionStats(user) {
    if (!AdminPermission.getSubscriptions(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getSubscriptionStats();
  }

  // Update subscription plan (admin only)
  async updateSubscriptionPlan(user, planId, updateData) {
    if (!AdminPermission.manageSubscriptions(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.updateSubscriptionPlan(planId, updateData);
  }
}

export const adminService = new AdminService();

