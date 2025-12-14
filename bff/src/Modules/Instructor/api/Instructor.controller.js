// Instructor Controller
// Uses orchestrators for cross-module operations
import { instructorService } from '../service/Instructor.service.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { instructorDashboardOrchestrator } from '../../../orchestrators/InstructorDashboard.orchestrator.js';
import { userService } from '../../User/service/User.service.js';

/**
 * Get instructor's courses
 * Uses instructor service directly (single module operation)
 */
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const courses = await instructorService.getCourses(user);
    res.json(courses);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor's enrolled students
 * Uses instructor service directly (single module operation)
 */
export const getMyStudents = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const students = await instructorService.getStudents(user);
    res.json(students);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor's revenue data
 * Uses instructor service directly (single module operation)
 */
export const getMyRevenue = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const revenue = await instructorService.getRevenue(user);
    res.json(revenue);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor's course performance metrics
 * Uses instructor service directly (single module operation)
 */
export const getMyCoursePerformance = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    const performance = await instructorService.getCoursePerformance(user);
    res.json(performance);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor's dashboard statistics
 * Uses instructor service directly (single module operation)
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const stats = await instructorService.getStats(user);
    res.json(stats);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor's revenue trends over time
 * Uses instructor service directly (single module operation)
 */
export const getRevenueTrends = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const trends = await instructorService.getRevenueTrends(user);
    res.json(trends);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor's recent activity
 * Uses instructor service directly (single module operation)
 */
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const activity = await instructorService.getRecentActivity(user);
    res.json(activity);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    } 
    res.status(500).json({ error: err.message });
  }
};
/**
 * Get student progress for a specific course (instructor view)
 * Uses instructor service directly (single module operation)
 */
export const getStudentProgressForCourse = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { courseId } = req.params;
    
    const progress = await instructorService.getStudentProgressForCourse(user, courseId);
    res.json({ progress });
  } catch (err) {
    if (err.message === 'Unauthorized' || err.message.includes('does not belong')) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
export const getInstructorStatus = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    res.json({ isInstructor: user.isInstructor, status: user.status });
  } catch (err) {
    if (err.message === 'Unauthorized' || err.message.includes('does not belong')) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

/**
 * ORCHESTRATED ENDPOINTS - Cross-module operations
 */ 
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    // Use orchestrator for cross-module aggregation
    const dashboardData = await instructorDashboardOrchestrator.getDashboardData(user);
    res.json(dashboardData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get instructor revenue overview
 * ORCHESTRATOR: Combines revenue data with trends
 * Cross-module: Instructor module (aggregation)
 */
export const getRevenueOverview = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    
    // Use orchestrator for revenue aggregation
    const revenueData = await instructorDashboardOrchestrator.getRevenueOverview(user);
    res.json(revenueData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get course performance with student progress details
 * ORCHESTRATOR: Merges course performance with progress tracking
 * Cross-module: Instructor + Progress modules
 */
export const getCoursePerformanceWithProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { courseId } = req.query; // Optional query param for specific course
    
    // Use orchestrator for cross-module data aggregation
    const performanceData = await instructorDashboardOrchestrator.getCoursePerformanceWithProgress(
      user,
      courseId || null
    );
    res.json(performanceData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
export const instructorController = {
  // Direct service calls (single module)
  getMyCourses,
  getMyStudents,
  getMyRevenue,
  getMyCoursePerformance,
  getStats,
  getRevenueTrends,
  getRecentActivity,
  getStudentProgressForCourse,
  // Orchestrated endpoints (cross-module)
  getDashboard,
  getRevenueOverview,
  getCoursePerformanceWithProgress,
};
