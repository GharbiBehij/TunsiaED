// bff/src/Modules/Course/api/Course.route.js
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { courseController } from './Course.controller.js';

const router = Router();

// CREATE course (admin/instructor only)
router.post('/onboard', authenticate, requireRole('admin', 'instructor'), courseController.createCourse);

// GET routes - specific paths BEFORE dynamic :courseId
router.get('/', courseController.getAllCourses); // Changed from '/course' to '/'
router.get('/system', courseController.getSystemCourses);
router.get('/categories', courseController.getAllCategories);
router.get('/category/:category', courseController.getCoursesByCategory);
router.get('/instructor/my-courses', authenticate, requireRole('instructor'), courseController.getCoursesByInstructor);

// Dynamic route LAST to avoid matching other paths
router.get('/:courseId', courseController.getCourseById);

// UPDATE and DELETE routes (ownership verified in controller)
router.put('/:courseId', authenticate, requireRole('admin', 'instructor'), courseController.updateCourse);
router.delete('/:courseId', authenticate, requireRole('admin', 'instructor'), courseController.deleteCourse);

export { router };

