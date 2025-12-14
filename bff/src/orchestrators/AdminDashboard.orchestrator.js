// Admin Dashboard Orchestrator
// Orchestrates cross-module data for admin dashboard
import { AdminPermission } from '../Modules/Admin/service/AdminPermission.js';
import { adminService } from '../Modules/Admin/service/Admin.service.js';
import { cacheClient } from '../core/cache/cacheClient.js';

/**
 * AdminDashboardOrchestrator
 * Aggregates all admin dashboard data from multiple services
 * Uses caching to reduce token/database load
 */
export class AdminDashboardOrchestrator {
  /**
   * Get complete admin dashboard data
   * @param {Object} user - Authenticated user with isAdmin boolean
   * @returns {Object} Dashboard DTO
   */
  async getDashboardData(user) {
    const cacheKey = `admin_dashboard_${user.uid}`;
    
    // 1. Validate permissions (check isAdmin boolean)

    if (!AdminPermission.getStats(user)) {
      throw new Error('Unauthorized');
    }
    console.log('✅ [AdminDash] Permissions validated');

    // 2. Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Aggregate data from admin service
    const [
      stats,
      revenueData,
      recentActivity,
      coursePerformance,
      userEngagement,
      activePromotions,
      subscriptionStats
    ] = await Promise.all([
      adminService.getStats(user),
      adminService.getRevenue(user),
      adminService.getRecentActivity(user, 10),
      adminService.getCoursePerformance(user),
      adminService.getUserEngagement(user),
      adminService.getActivePromotions(user),
      adminService.getSubscriptionStats(user),
    ]);

    // 4. Build aggregated DTO
    const result = {
      stats,
      revenueData,
      recentActivity,
      coursePerformance,
      userEngagement,
      activePromotions,
      subscriptionStats,
    };

    // 5. Cache for 5 minutes (admin data changes less frequently)
    await cacheClient.set(cacheKey, result, 300);
    return result;
  }

  /**
   * Get admin revenue overview
   * @param {Object} user - Authenticated user
   * @returns {Object} Revenue DTO
   */
  async getRevenueOverview(user) {
    const cacheKey = `admin_revenue_${user.uid}`;
    
    if (!AdminPermission.getRevenue(user)) {
      throw new Error('Unauthorized');
    }

    const cached = await cacheClient.get(cacheKey);
    if (cached) return cached;

    const [revenue, trends] = await Promise.all([
      adminService.getRevenue(user),
      adminService.getRevenueTrends(user),
    ]);

    const result = { revenue, trends };
    await cacheClient.set(cacheKey, result, 600); // 10 min cache
    return result;
  }

  /**
   * Get user engagement analytics
   * @param {Object} user - Authenticated user
   * @returns {Object} Engagement DTO
   */
  async getUserEngagementAnalytics(user) {
    if (!AdminPermission.getStats(user)) {
      throw new Error('Unauthorized');
    }

    return await adminService.getUserEngagement(user);
  }
}

export const adminDashboardOrchestrator = new AdminDashboardOrchestrator();
