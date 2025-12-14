// bff/src/Modules/Admin/service/Admin.service.js
import { adminRepository } from '../repository/Admin.repository.js';
import { AdminPermission } from './AdminPermission.js';
import { cacheClient } from '../../../core/cache/cacheClient.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { FirebaseAuthAdapter } from '../../../adapters/firebaseAdapter.js';

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

  // Get subscription plans (admin only - returns all plans)
  async getSubscriptionPlans(user) {
    if (!AdminPermission.getSubscriptions(user)) {
      throw new Error('Unauthorized');
    }
    return await adminRepository.getSubscriptionPlans();
  }

  // Get subscription plans (public - returns only active plans)
  async getSubscriptionPlansPublic() {
    const cacheKey = 'subscription_plans_public';
    
    // Check cache first (30 min cache - plans don't change often)
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const allPlans = await adminRepository.getSubscriptionPlans();
    const activePlans = allPlans
      .filter(plan => plan.isActive !== false)
      .sort((a, b) => (a.price || 0) - (b.price || 0));
    
    // Cache for 30 minutes
    await cacheClient.set(cacheKey, activePlans, 1800);
    
    return activePlans;
  }

  // Get single subscription plan (public - returns only if active)
  async getSubscriptionPlanByIdPublic(planId) {
    const cacheKey = `subscription_plan_${planId}`;
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached !== null) {
      return cached;
    }
    
    const allPlans = await adminRepository.getSubscriptionPlans();
    const plan = allPlans.find(p => p.id === planId);
    const result = (plan && plan.isActive !== false) ? plan : null;
    
    // Cache for 30 minutes
    await cacheClient.set(cacheKey, result, 1800);
    
    return result;
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
    
    const result = await adminRepository.updateSubscriptionPlan(planId, updateData);
    
    // Invalidate subscription plan caches
    await Promise.all([
      cacheClient.del('subscription_plans_public'),
      cacheClient.del(`subscription_plan_${planId}`),
    ]);
    
    return result;
  }

  // ========== User Management ==========

  async getAllUsers(user, options = {}) {
    if (!AdminPermission.manageUsers(user)) {
      throw new Error('Unauthorized');
    }
    return await userRepository.getAllUsers(options);
  }

  async banUser(user, targetUserId) {
    if (!AdminPermission.manageUsers(user)) {
      throw new Error('Unauthorized');
    }
    await FirebaseAuthAdapter.updateUser(targetUserId, { disabled: true });
    return await userRepository.updateProfile(targetUserId, { banned: true });
  }

  async unbanUser(user, targetUserId) {
    if (!AdminPermission.manageUsers(user)) {
      throw new Error('Unauthorized');
    }
    await FirebaseAuthAdapter.updateUser(targetUserId, { disabled: false });
    return await userRepository.updateProfile(targetUserId, { banned: false });
  }

  // Approve instructor application (admin only)
async approveInstructor(user, targetUserId) {
  if (!AdminPermission.manageUsers(user)) {
    throw new Error('Unauthorized');
  }

  const targetUser = await userRepository.findByUid(targetUserId);
  if (!targetUser) {
    throw new Error('User not found');
  }

  // Only set instructor flag; do not force isAdmin/isStudent false
  const claims = {
    isInstructor: true,
  };

  await FirebaseAuthAdapter.setCustomClaims(targetUserId, claims);

  return await userRepository.updateProfile(targetUserId, {
    isInstructor: true,
    instructorStatus: 'approved',
    role: 'instructor',
  });
}

  // Decline instructor application (admin only)
async declineInstructor(user, targetUserId, reason) {
  if (!AdminPermission.manageUsers(user)) {
    throw new Error('Unauthorized');
  }

  const targetUser = await userRepository.findByUid(targetUserId);
  if (!targetUser) {
    throw new Error('User not found');
  }

  return await userRepository.updateProfile(targetUserId, {
    instructorStatus: 'declined',
    instructorDeclineReason: reason || 'Application requirements not met',
  });
}


  // ========== Course Management ==========

  async getAllCourses(user, options = {}) {
    if (!AdminPermission.manageCourses(user)) {
      throw new Error('Unauthorized');
    }
    return await courseRepository.getAllCourses(options);
  }

  async approveCourse(user, courseId) {
    if (!AdminPermission.manageCourses(user)) {
      throw new Error('Unauthorized');
    }
    return await courseRepository.updateCourse(courseId, { status: 'approved' });
  }

  async rejectCourse(user, courseId, reason) {
    if (!AdminPermission.manageCourses(user)) {
      throw new Error('Unauthorized');
    }
    return await courseRepository.updateCourse(courseId, { status: 'rejected', rejectionReason: reason });
  }
}

export const adminService = new AdminService();

