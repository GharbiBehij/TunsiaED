// bff/src/Modules/Enrollement/Api/Routes/Enrollement.routes.js
import { Router } from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { enrollmentController } from '../Controller/Enrollement.controller.js';
// import { requireRole } from '../../../../middlewares/Role.middleware.js'; If/when needed for create/delete

const router = Router();

router.post('/enroll', authenticate, enrollmentController.enroll);
router.get('/enrollments', authenticate, enrollmentController.getUserEnrollments);
router.get('/:enrollmentId', authenticate, enrollmentController.getEnrollmentById);
router.get('/course/:courseId/students', authenticate, enrollmentController.getStudentsForCourse);

export { router };

