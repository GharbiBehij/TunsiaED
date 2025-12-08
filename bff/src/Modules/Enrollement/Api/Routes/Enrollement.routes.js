// bff/src/Modules/Enrollement/Api/Routes/Enrollement.routes.js
import { Router } from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../../middlewares/Role.middleware.js';
import { enrollmentController } from '../Controller/Enrollement.controller.js';

const router = Router();

router.post('/enroll', authenticate, requireRole('admin', 'student'), enrollmentController.enroll);
router.get('/my-enrollments', authenticate, requireRole('admin', 'student'), enrollmentController.getUserEnrollments);
router.get('/:enrollmentId', authenticate, requireRole('admin', 'student'), enrollmentController.getEnrollmentById);
router.get('/course/:courseId/students', authenticate, requireRole('admin', 'instructor'), enrollmentController.getStudentsForCourse);

// Progress tracking routes
router.get('/course/:courseId/progress', authenticate, requireRole('admin', 'instructor'), enrollmentController.getCourseEnrollmentsWithProgress);
router.get('/:enrollmentId/progress', authenticate, requireRole('admin', 'student'), enrollmentController.getEnrollmentWithProgress);

export { router };

