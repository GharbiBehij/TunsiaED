import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { adminController } from './Admin.controller.js';

const router = Router();

// All admin routes require authentication and admin role
router.get('/stats', authenticate, requireRole('admin'), adminController.getStats);
router.get('/revenue', authenticate, requireRole('admin'), adminController.getRevenue);
router.get('/activity', authenticate, requireRole('admin'), adminController.getRecentActivity);
router.get('/courses/performance', authenticate, requireRole('admin'), adminController.getCoursePerformance);
router.get('/engagement', authenticate, requireRole('admin'), adminController.getUserEngagement);

export { router };

