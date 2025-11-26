// bff/src/Modules/Enrollement/Api/Routes/Enrollement.routes.js
import { Router } from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { enrollmentController } from '../Controller/Enrollement.controller.js';

const router = Router();

// All enrollment routes require authentication
router.post('/enroll',authenticate,enrollmentController.enroll);

router.get('/enrollments',authenticate,enrollmentController.getUserEnrollments);

router.get('/:enrollmentId',authenticate,enrollmentController.getEnrollmentById);

// Add this route
router.get('/course/:courseId/students', authenticate, enrollmentController.getStudentsForCourse);
export { router };

