// Progress Routes
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { progressController } from './Progress.controller.js';

const router = Router();

// Student routes - manage own progress
router.post('/', authenticate, requireRole('admin', 'student'), progressController.getOrCreateProgress.bind(progressController));
router.get('/my-progress', authenticate, requireRole('admin', 'student'), progressController.getMyProgress.bind(progressController));
router.get('/enrollment/:enrollmentId', authenticate, requireRole('admin', 'student'), progressController.getProgressByEnrollment.bind(progressController));
router.get('/course/:courseId/summary', authenticate, requireRole('admin', 'student'), progressController.getUserCourseProgressSummary.bind(progressController));
router.get('/:progressId', authenticate, progressController.getProgressById.bind(progressController));
router.patch('/:progressId', authenticate, requireRole('admin', 'student'), progressController.updateProgress.bind(progressController));
router.post('/:progressId/complete-item', authenticate, requireRole('admin', 'student'), progressController.markItemCompleted.bind(progressController));

// Instructor routes - view student progress
router.get('/module/:moduleType/:moduleId', authenticate, requireRole('admin', 'instructor'), progressController.getProgressByModule.bind(progressController));

// Admin routes - delete progress
router.delete('/:progressId', authenticate, requireRole('admin'), progressController.deleteProgress.bind(progressController));

export { router };
