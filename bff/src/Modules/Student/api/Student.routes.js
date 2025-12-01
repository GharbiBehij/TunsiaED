import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { studentController } from './Student.controller.js';

const router = Router();

// All student routes require authentication and student role
router.get('/enrollments', authenticate, requireRole('admin', 'student'), studentController.getMyEnrollments);
router.get('/progress', authenticate, requireRole('admin', 'student'), studentController.getMyProgress);
router.get('/certificates', authenticate, requireRole('admin', 'student'), studentController.getMyCertificates);
router.get('/stats', authenticate, requireRole('admin', 'student'), studentController.getMyStats);
router.get('/courses', authenticate, requireRole('admin', 'student'), studentController.getMyCourses);

export { router };

