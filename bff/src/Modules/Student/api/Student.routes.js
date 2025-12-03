import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { studentController } from './Student.controller.js';

const router = Router();

// All student routes require authentication and student role
// DIRECT SERVICE ROUTES - Single module operations
router.get('/enrollments', authenticate, requireRole('admin', 'student'), studentController.getMyEnrollments);
router.get('/progress', authenticate, requireRole('admin', 'student'), studentController.getMyProgress);
router.get('/certificates', authenticate, requireRole('admin', 'student'), studentController.getMyCertificates);
router.get('/stats', authenticate, requireRole('admin', 'student'), studentController.getMyStats);
router.get('/courses', authenticate, requireRole('admin', 'student'), studentController.getMyCourses);
router.patch('/progress', authenticate, requireRole('admin', 'student'), studentController.updateMyProgress);

// ORCHESTRATED ROUTES - Cross-module aggregation endpoints
// Dashboard orchestrator - aggregates stats and courses
router.get('/dashboard', authenticate, requireRole('admin', 'student'), studentController.getDashboard);
// Enrollments with progress - merges enrollment and progress data
router.get('/enrollments/detailed', authenticate, requireRole('admin', 'student'), studentController.getEnrollmentsWithProgress);
// Learning overview - comprehensive view of stats, progress, certificates
router.get('/learning/overview', authenticate, requireRole('admin', 'student'), studentController.getLearningOverview);
// Progress orchestration - updates progress with enrollment sync
router.post('/progress/update', authenticate, requireRole('admin', 'student'), studentController.updateProgressOrchestrated);
// Progress by enrollment - detailed progress for specific enrollment
router.get('/progress/enrollment/:enrollmentId', authenticate, requireRole('admin', 'student'), studentController.getProgressByEnrollment);
// Progress by course - course-specific progress summary
router.get('/progress/course/:courseId', authenticate, requireRole('admin', 'student'), studentController.getProgressByCourse);
// Progress overview - all courses progress summary
router.get('/progress/overview', authenticate, requireRole('admin', 'student'), studentController.getProgressOverview);

export { router };

