// Instructor Controller
import { instructorService } from '../service/Instructor.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const courses = await instructorService.getMyCourses(user);
    res.json(courses);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const students = await instructorService.getMyStudents(user);
    res.json(students);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getMyRevenue = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const revenue = await instructorService.getMyRevenue(user);
    res.json(revenue);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getMyCoursePerformance = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const performance = await instructorService.getMyCoursePerformance(user);
    res.json(performance);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const stats = await instructorService.getStats(user);
    res.json(stats);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getRevenueTrends = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const trends = await instructorService.getRevenueTrends(user);
    res.json(trends);
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
    const activity = await instructorService.getRecentActivity(user, limit);
    res.json(activity);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const instructorController = {
  getMyCourses,
  getMyStudents,
  getMyRevenue,
  getMyCoursePerformance,
  getStats,
  getRevenueTrends,
  getRecentActivity,
};

