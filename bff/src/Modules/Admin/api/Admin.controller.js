// Admin Controller
// All operations are single-module (Admin module only)
// No orchestrators needed - direct service calls
import { adminService } from '../service/Admin.service.js';
import { userService } from '../../User/Service/User.Servicejs';

/**
 * Get admin dashboard statistics
 * Uses admin service directly (single module operation)
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const stats = await adminService.getStats(user);
    res.json(stats);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get platform revenue data
 * Uses admin service directly (single module operation)
 */
export const getRevenue = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const revenue = await adminService.getRevenue(user);
    res.json(revenue);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get recent platform activity
 * Uses admin service directly (single module operation)
 */
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const limit = parseInt(req.query.limit) || 10;
    
    const activity = await adminService.getRecentActivity(user, limit);
    res.json(activity);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get course performance metrics
 * Uses admin service directly (single module operation)
 */
export const getCoursePerformance = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const performance = await adminService.getCoursePerformance(user);
    res.json(performance);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get user engagement metrics
 * Uses admin service directly (single module operation)
 */
export const getUserEngagement = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const engagement = await adminService.getUserEngagement(user);
    res.json(engagement);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get active promotions
 * Uses admin service directly (single module operation)
 */
export const getActivePromotions = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const promotions = await adminService.getActivePromotions(user);
    res.json(promotions);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create new promotion
 * Uses admin service directly (single module operation)
 */
export const createPromotion = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const promotion = await adminService.createPromotion(user, req.body);
    res.status(201).json(promotion);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get subscription plans
 * Uses admin service directly (single module operation)
 */
export const getSubscriptionPlans = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const plans = await adminService.getSubscriptionPlans(user);
    res.json(plans);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get subscription statistics
 * Uses admin service directly (single module operation)
 */
export const getSubscriptionStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const stats = await adminService.getSubscriptionStats(user);
    res.json(stats);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update subscription plan
 * Uses admin service directly (single module operation)
 */
export const updateSubscriptionPlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { planId } = req.params;
    
    const plan = await adminService.updateSubscriptionPlan(user, planId, req.body);
    res.json(plan);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { page, limit, role } = req.query;
    const options = { page: parseInt(page) || 1, limit: parseInt(limit) || 20, role };
    
    const users = await adminService.getAllUsers(user, options);
    res.json(users);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Ban user (admin only)
 */
export const banUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { userId: targetUserId } = req.params;
    
    await adminService.banUser(user, targetUserId);
    res.json({ message: 'User banned successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Unban user (admin only)
 */
export const unbanUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { userId: targetUserId } = req.params;
    
    await adminService.unbanUser(user, targetUserId);
    res.json({ message: 'User unbanned successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Approve instructor application (admin only)
 */
export const approveInstructor = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { userId: targetUserId } = req.params;
    
    await adminService.approveInstructor(user, targetUserId);
    res.json({ message: 'Instructor approved successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Decline instructor application (admin only)
 */
export const declineInstructor = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { userId: targetUserId } = req.params;
    const { reason } = req.body;
    
    await adminService.declineInstructor(user, targetUserId, reason);
    res.json({ message: 'Instructor application declined' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all courses (admin only)
 */
export const getAllCourses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { page, limit, status } = req.query;
    const options = { page: parseInt(page) || 1, limit: parseInt(limit) || 20, status };
    
    const courses = await adminService.getAllCourses(user, options);
    res.json(courses);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Approve course (admin only)
 */
export const approveCourse = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { courseId } = req.params;
    
    await adminService.approveCourse(user, courseId);
    res.json({ message: 'Course approved successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Reject course (admin only)
 */
export const rejectCourse = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { courseId } = req.params;
    const { reason } = req.body;
    
    await adminService.rejectCourse(user, courseId, reason);
    res.json({ message: 'Course rejected successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const adminController = {
  // All single module operations (Admin module)
  getStats,
  getRevenue,
  getRecentActivity,
  getCoursePerformance,
  getUserEngagement,
  getActivePromotions,
  createPromotion,
  getSubscriptionPlans,
  getSubscriptionStats,
  updateSubscriptionPlan,
  getAllUsers,
  banUser,
  unbanUser,
  approveInstructor,
  declineInstructor,
  getAllCourses,
  approveCourse,
  rejectCourse,
};
