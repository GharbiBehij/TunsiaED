// Admin Repository layer
import { adminDao } from '../model/dao/Admin.dao.js';

export class AdminRepository {
  async getStats() {
    const [totalRevenue, newUsers, activeCourses, activeSubscriptions] = await Promise.all([
      adminDao.getTotalRevenue(),
      adminDao.getNewUsersCount(),
      adminDao.getActiveCoursesCount(),
      adminDao.getActiveSubscriptionsCount()
    ]);

    return {
      totalRevenue,
      newUsers,
      activeCourses,
      activeSubscriptions
    };
  }

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

  async getRecentActivity(limit = 10) {
    return await adminDao.getRecentActivity(limit);
  }

  async getCoursePerformance() {
    return await adminDao.getCoursePerformance();
  }

  async getUserEngagement() {
    return await adminDao.getUserEngagement();
  }
}

export const adminRepository = new AdminRepository();

