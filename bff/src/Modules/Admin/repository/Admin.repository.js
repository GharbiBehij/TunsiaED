// Admin Repository layer
import { adminDao } from '../model/dao/Admin.dao.js';

export class AdminRepository {
  // Aggregate dashboard statistics via DAO
  async getStats() {
    const [totalRevenue, newUsers, activeCourses, activeSubscriptions] = await Promise.all([
      adminDao.getTotalRevenue(),
      adminDao.getNewUsersCount(),
      adminDao.getActiveCoursesCount(),
      adminDao.getActiveSubscriptionsCount()
    ]);

    return {
      revenue: totalRevenue,
      newUsers,
      activeCourses,
      subscriptions: activeSubscriptions
    };
  }

  // Get revenue data with growth calculation via DAO
  async getRevenue() {
    const monthly = await adminDao.getMonthlyRevenue();
    const total = monthly.reduce((sum, item) => sum + item.revenue, 0);
    
    // Calculate growth (comparing last two months)
    let growth = 0;
    if (monthly.length >= 2) {
      const lastMonth = monthly[monthly.length - 1].revenue;
      const prevMonth = monthly[monthly.length - 2].revenue;
      if (prevMonth > 0) {
        growth = ((lastMonth - prevMonth) / prevMonth) * 100;
      }
    }

    return {
      monthly,
      total,
      growth: Math.round(growth * 10) / 10
    };
  }

  // Get recent platform activity via DAO
  async getRecentActivity(limit = 10) {
    return await adminDao.getRecentActivity(limit);
  }

  // Get course performance metrics via DAO
  async getCoursePerformance() {
    return await adminDao.getCoursePerformance();
  }

  // Get user engagement metrics via DAO
  async getUserEngagement() {
    return await adminDao.getUserEngagement();
  }

  // Get active promotions via DAO
  async getActivePromotions() {
    return await adminDao.getActivePromotions();
  }

  // Create new promotion via DAO
  async createPromotion(promotionData) {
    return await adminDao.createPromotion(promotionData);
  }

  // Get subscription plans via DAO
  async getSubscriptionPlans() {
    return await adminDao.getSubscriptionPlans();
  }

  // Get subscription statistics via DAO
  async getSubscriptionStats() {
    return await adminDao.getSubscriptionStats();
  }

  // Update subscription plan via DAO
  async updateSubscriptionPlan(planId, updateData) {
    return await adminDao.updateSubscriptionPlan(planId, updateData);
  }
}

export const adminRepository = new AdminRepository();

