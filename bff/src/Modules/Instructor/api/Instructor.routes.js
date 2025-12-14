import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { instructorController } from './Instructor.controller.js';

const router = Router();

// All instructor routes require authentication and instructor role
router.get('/courses', authenticate, requireRole('admin', 'instructor'), instructorController.getMyCourses);
router.get('/students', authenticate, requireRole('admin', 'instructor'), instructorController.getMyStudents);
router.get('/revenue', authenticate, requireRole('admin', 'instructor'), instructorController.getMyRevenue);
router.get('/courses/performance', authenticate, requireRole('admin', 'instructor'), instructorController.getMyCoursePerformance);
router.get('/stats', authenticate, requireRole('admin', 'instructor'), instructorController.getStats);
router.get('/revenue-trends', authenticate, requireRole('admin', 'instructor'), instructorController.getRevenueTrends);
router.get('/activity', authenticate, requireRole('admin', 'instructor'), instructorController.getRecentActivity);

// Student progress tracking (instructor view)
router.get('/courses/:courseId/students/progress', authenticate, requireRole('admin', 'instructor'), instructorController.getStudentProgressForCourse);
router.get('/status', authenticate, instructorController.getInstructorStatus);
// ORCHESTRATED ROUTES - Cross-module aggregation endpoints
// Dashboard orchestrator - aggregates data from multiple sources
router.get('/dashboard', authenticate, requireRole('admin', 'instructor'), instructorController.getDashboard);
// Revenue overview orchestrator - combines revenue and trends
router.get('/revenue/overview', authenticate, requireRole('admin', 'instructor'), instructorController.getRevenueOverview);
// Course performance with progress - merges performance and student progress
router.get('/courses/performance/detailed', authenticate, requireRole('admin', 'instructor'), instructorController.getCoursePerformanceWithProgress);

export { router };

