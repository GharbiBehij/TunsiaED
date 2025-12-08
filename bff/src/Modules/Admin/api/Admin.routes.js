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

// Promotion routes
router.get('/promotions/active', authenticate, requireRole('admin'), adminController.getActivePromotions);
router.post('/promotions', authenticate, requireRole('admin'), adminController.createPromotion);

// Subscription routes
router.get('/subscriptions/plans', authenticate, requireRole('admin'), adminController.getSubscriptionPlans);
router.get('/subscriptions/stats', authenticate, requireRole('admin'), adminController.getSubscriptionStats);
router.patch('/subscriptions/:planId', authenticate, requireRole('admin'), adminController.updateSubscriptionPlan);

// User management routes
router.get('/users', authenticate, requireRole('admin'), adminController.getAllUsers);
router.patch('/users/:userId/ban', authenticate, requireRole('admin'), adminController.banUser);
router.patch('/users/:userId/unban', authenticate, requireRole('admin'), adminController.unbanUser);

// Instructor management routes
router.patch('/instructors/:userId/approve', authenticate, requireRole('admin'), adminController.approveInstructor);
router.patch('/instructors/:userId/decline', authenticate, requireRole('admin'), adminController.declineInstructor);

// Course management routes
router.get('/courses', authenticate, requireRole('admin'), adminController.getAllCourses);
router.patch('/courses/:courseId/approve', authenticate, requireRole('admin'), adminController.approveCourse);
router.patch('/courses/:courseId/reject', authenticate, requireRole('admin'), adminController.rejectCourse);

export { router };

