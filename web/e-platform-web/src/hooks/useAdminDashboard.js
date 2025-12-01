import { useQuery } from '@tanstack/react-query';
import AdminService from '../services/AdminService';
import { useAuth } from '../context/AuthContext';

export function useAdminDashboard() {
  const { token } = useAuth();
  return useQuery(['dashboard-admin'], async () => {
    const [
      stats,
      revenueChart,
      recentActivity,
      coursePerformance,
      userEngagement,
      activePromotions,
      subscriptionPlans,
      subscriptionStats,
    ] = await Promise.all([
      AdminService.getStats(token),
      AdminService.getRevenueData(token),
      AdminService.getRecentActivity(token),
      AdminService.getCoursePerformance(token),
      AdminService.getUserEngagement(token),
      AdminService.getActivePromotions(token),
      AdminService.getSubscriptionPlans(token),
      AdminService.getSubscriptionStats(token),
      AdminService.updateSubscriptionPlan(token),
    ]);
    return {
      stats,
      revenueChart,
      recentActivity,
      coursePerformance,
      userEngagement,
      activePromotions,
      subscriptionPlans,
      subscriptionStats,
    };
  });
}
