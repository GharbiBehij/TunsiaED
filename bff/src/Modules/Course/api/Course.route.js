// src/modules/Course/api/Course.route.js
import { Router } from 'express';
import { courseController } from './Course.controller.js';
import { authenticate } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Create course - requires authentication (instructor only)
router.post(
  '/',
  authenticate,
  courseController.createCourse
);

// Get all courses - public endpoint
router.get('/', courseController.getAllCourses);

// Get courses by category - public endpoint
router.get('/category/:category', courseController.getCoursesByCategory);

// Get instructor's courses - requires authentication
router.get(
  '/instructor/my-courses',
  authenticate,
  courseController.getCoursesByInstructor
);

// Get course by ID - public endpoint
router.get('/:courseId', courseController.getCourseById);

// Update course - requires authentication (instructor only, own courses)
router.put(
  '/:courseId',
  authenticate,
  courseController.updateCourse
);

// Delete course - requires authentication (instructor only, own courses)
router.delete(
  '/:courseId',
  authenticate,
  courseController.deleteCourse
);

export { router };

