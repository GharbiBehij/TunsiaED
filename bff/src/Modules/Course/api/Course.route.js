// bff/src/Modules/Course/api/Course.route.js
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { courseController } from './Course.controller.js';

const router = Router();

router.post('/', authenticate, requireRole('admin', 'instructor'), courseController.createCourse);

router.get('/', courseController.getAllCourses);
router.get('/system', courseController.getSystemCourses);
router.get('/categories', courseController.getAllCategories);
router.get('/category/:category', courseController.getCoursesByCategory);
router.get('/instructor/my-courses', authenticate, courseController.getCoursesByInstructor);
router.get('/:courseId', courseController.getCourseById);

router.put('/:courseId', authenticate, requireRole('admin', 'instructor'), courseController.updateCourse);
router.delete('/:courseId', authenticate, requireRole('admin', 'instructor'), courseController.deleteCourse);

export { router };

