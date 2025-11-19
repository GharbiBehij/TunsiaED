// src/modules/Enrollement/Api/Enrollement.routes.js
import { Router } from 'express';
import { enrollmentController } from '../Controller/Enrollement.controller.js';
import { validateBody } from '../../../../middlewares/validation.middleware.js';
import { CreateEnrollmentRequest } from '../../dto/Enrollement.request.dto.js';
import { authenticate } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// All enrollment routes require authentication
router.post(
  '/enroll',
  authenticate,
  validateBody(CreateEnrollmentRequest),
  enrollmentController.enroll
);

router.get(
  '/my-enrollments',
  authenticate,
  enrollmentController.getUserEnrollments
);

router.get(
  '/:enrollmentId',
  authenticate,
  enrollmentController.getEnrollmentById
);

export { router };

