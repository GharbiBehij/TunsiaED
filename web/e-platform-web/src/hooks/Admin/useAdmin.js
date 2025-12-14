// Centralized Admin Actor React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '../../services/AdminService';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_KEYS } from '../../core/query/queryKeys';

/**
 * Get admin dashboard statistics
 * Stale after 2 minutes (dashboard data changes frequently)
 */
export function useAdminStats() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: () => AdminService.getStats(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Get revenue analytics data
 * Stale after 5 minutes (financial data less volatile)
 */
export function useAdminRevenue() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.revenue(),
    queryFn: () => AdminService.getRevenueData(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get recent platform activity
 * Stale after 1 minute (activity stream updates frequently)
 */
export function useAdminActivity() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.activity(),
    queryFn: () => AdminService.getRecentActivity(token),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token,
  });
}

/**
 * Get course performance metrics
 * Stale after 5 minutes
 */
export function useAdminCoursePerformance() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.coursePerformance(),
    queryFn: () => AdminService.getCoursePerformance(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get user engagement metrics
 * Stale after 3 minutes
 */
export function useAdminUserEngagement() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.userEngagement(),
    queryFn: () => AdminService.getUserEngagement(token),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!token,
  });
}

/**
 * Get active promotions
 * Stale after 5 minutes
 */
export function useAdminActivePromotions() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.activePromotions(),
    queryFn: () => AdminService.getActivePromotions(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get subscription plans
 * Stale after 10 minutes (plans rarely change)
 */
export function useAdminSubscriptionPlans() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.subscriptionPlans(),
    queryFn: () => AdminService.getSubscriptionPlans(token),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!token,
  });
}

/**
 * Get subscription statistics
 * Stale after 5 minutes
 */
export function useAdminSubscriptionStats() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.subscriptionStats(),
    queryFn: () => AdminService.getSubscriptionStats(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get complete admin dashboard data (aggregated)
 * Combines all dashboard queries with parallel fetching
 * Stale after 2 minutes
 */
export function useAdminDashboard() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.dashboard(),
    queryFn: async () => {
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
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Update subscription plan
 * Invalidates subscription-related queries on success
 */
export function useUpdateSubscriptionPlan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ planId, data }) => 
      AdminService.updateSubscriptionPlan(token, planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.subscriptions() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.revenue() });
    },
  });
}

/**
 * Create new promotion
 * Invalidates promotions queries on success
 */
export function useCreatePromotion() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => AdminService.createPromotion(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.promotions() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.revenue() });
    },
  });
}

/**
 * Get all users (admin only)
 * Stale after 3 minutes
 */
export function useAdminUsers(options = {}) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.users(options),
    queryFn: () => AdminService.getAllUsers(token, options),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!token,
  });
}

/**
 * Ban user mutation
 * Invalidates user-related queries on success
 */
export function useBanUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => AdminService.banUser(token, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
    },
  });
}

/**
 * Unban user mutation
 * Invalidates user-related queries on success
 */
export function useUnbanUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => AdminService.unbanUser(token, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
    },
  });
}

/**
 * Approve instructor application
 * Invalidates user and instructor queries on success
 */
export function useApproveInstructor() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => AdminService.approveInstructor(token, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.userEngagement() });
    },
  });
}

/**
 * Decline instructor application
 * Invalidates user queries on success
 */
export function useDeclineInstructor() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, reason }) => AdminService.declineInstructor(token, userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
    },
  });
}

/**
 * Get all courses (admin only)
 * Stale after 5 minutes
 */
export function useAdminCourses(options = {}) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ADMIN_KEYS.courses(options),
    queryFn: () => AdminService.getAllCourses(token, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Approve course mutation
 * Invalidates course-related queries on success
 */
export function useApproveCourse() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId) => AdminService.approveCourse(token, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.courses() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.coursePerformance() });
    },
  });
}

/**
 * Reject course mutation
 * Invalidates course-related queries on success
 */
export function useRejectCourse() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reason }) => AdminService.rejectCourse(token, courseId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.courses() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
    },
  });
}
