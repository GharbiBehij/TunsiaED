// Admin Controller
// All operations are single-module (Admin module only)
// No orchestrators needed - direct service calls
import { adminService } from '../service/Admin.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

/**
 * Get admin dashboard statistics
 * Uses admin service directly (single module operation)
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
    
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
    const user = await userRepository.findByUid(userId);
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
};
