// Admin Controller
import { adminService } from '../service/Admin.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

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

export const adminController = {
  getStats,
  getRevenue,
  getRecentActivity,
  getCoursePerformance,
  getUserEngagement,
};

