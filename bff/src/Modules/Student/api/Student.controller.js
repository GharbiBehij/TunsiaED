// Student Controller
// Uses orchestrators for cross-module operations
import { studentService } from '../service/Student.service.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { studentDashboardOrchestrator } from '../../../orchestrators/StudentDashboard.orchestrator.js';
import { userProgressOrchestrator } from '../../../orchestrators/UserProgress.orchestrator.js';

/**
 * Get student's enrollments
 * Uses student service directly (single module operation)
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const enrollments = await studentService.getEnrollments(user);
    res.json(enrollments);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student's progress
 * Uses student service directly (single module operation)
 */
export const getMyProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const progress = await studentService.getProgress(user);
    res.json(progress);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student's certificates
 * Uses student service directly (single module operation)
 */
export const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const certificates = await studentService.getCertificates(user);
    res.json(certificates);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student's statistics
 * Uses student service directly (single module operation)
 */
export const getMyStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const stats = await studentService.getStats(user);
    res.json(stats);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student's enrolled courses
 * Uses student service directly (single module operation)
 */
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const courses = await studentService.getCourses(user);
    res.json(courses);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update student's progress (complete lesson)
 * Uses student service directly (single module operation)
 */
export const updateMyProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const { enrollmentId } = req.params;
    const { lessonId } = req.body;
    
    if (!lessonId) {
      return res.status(400).json({ message: "lessonId is required" });
    }
    
    const updated = await studentService.completeLesson(user, enrollmentId, lessonId);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
/**
 * ORCHESTRATED ENDPOINTS - Cross-module operations
 */

/**
 * Get complete student dashboard data
 * ORCHESTRATOR: Aggregates stats and courses
 * Cross-module: Student module (aggregation)
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    // Use orchestrator for dashboard aggregation
    const dashboardData = await studentDashboardOrchestrator.getDashboardData(user);
    res.json(dashboardData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student enrollments with detailed progress
 * ORCHESTRATOR: Merges enrollments with progress from Progress module
 * Cross-module: Student + Progress modules
 */
export const getEnrollmentsWithProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    // Use orchestrator for cross-module data merging
    const enrollmentsData = await studentDashboardOrchestrator.getEnrollmentsWithProgress(user);
    res.json(enrollmentsData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student's learning overview
 * ORCHESTRATOR: Aggregates stats, progress, and certificates
 * Cross-module: Student + Progress + Certificate modules
 */
export const getLearningOverview = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    // Use orchestrator for comprehensive learning overview
    const overviewData = await studentDashboardOrchestrator.getLearningOverview(user);
    res.json(overviewData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update progress with orchestration
 * ORCHESTRATOR: Updates progress and syncs with enrollment
 * Cross-module: Progress + Enrollment modules
 */
export const updateProgressOrchestrated = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const { enrollmentId, courseId, progress, itemId, totalItems } = req.body;
    
    if (!enrollmentId || !courseId) {
      return res.status(400).json({ error: 'enrollmentId and courseId are required' });
    }
    
    // Use orchestrator for cross-module progress update
    const updatedProgress = await userProgressOrchestrator.updateProgress(user, {
      enrollmentId,
      courseId,
      progress,
      itemId,
      totalItems,
    });
    res.json(updatedProgress);
  } catch (err) {
    if (err.message === 'Unauthorized' || err.message.includes('not found')) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get progress by enrollment
 * ORCHESTRATOR: Retrieves all progress for an enrollment
 * Cross-module: Progress + Enrollment modules
 */
export const getProgressByEnrollment = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const { enrollmentId } = req.params;
    
    // Use orchestrator for progress retrieval
    const progressData = await userProgressOrchestrator.getProgressByEnrollment(user, enrollmentId);
    res.json(progressData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get progress by course
 * ORCHESTRATOR: Retrieves progress summary for a course
 * Cross-module: Progress + Enrollment + Course modules
 */
export const getProgressByCourse = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const { courseId } = req.params;
    
    // Use orchestrator for course progress summary
    const progressData = await userProgressOrchestrator.getProgressByCourse(user, courseId);
    res.json(progressData);
  } catch (err) {
    if (err.message === 'Unauthorized' || err.message.includes('not found')) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get user progress overview
 * ORCHESTRATOR: Comprehensive progress overview across all courses
 * Cross-module: Progress + Enrollment modules
 */
export const getProgressOverview = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    // Use orchestrator for progress overview
    const overviewData = await userProgressOrchestrator.getUserProgressOverview(user);
    res.json(overviewData);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const studentController = {
  // Direct service calls (single module)
  getMyEnrollments,
  getMyProgress,
  getMyCertificates,
  getMyStats,
  getMyCourses,
  updateMyProgress,
  // Orchestrated endpoints (cross-module)
  getDashboard,
  getEnrollmentsWithProgress,
  getLearningOverview,
  updateProgressOrchestrated,
  getProgressByEnrollment,
  getProgressByCourse,
  getProgressOverview,
};
