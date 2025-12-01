import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { certificateController } from './Certificate.controller.js';

const router = Router();

// Authenticated user can issue certificate for themselves (guarded in service).
router.post('/', authenticate, certificateController.issueCertificate);

// Authenticated user: own certificates.
router.get('/me', authenticate, certificateController.getMyCertificates);

// Public read of a specific certificate (you can tighten this later).
router.get('/:certificateId', certificateController.getCertificateById);

// Public list by course (e.g., for admin dashboards).
router.get('/course/:courseId', certificateController.getCourseCertificates);

// Admin-style aggregate endpoints.
router.get('/', certificateController.getAllCertificates);
router.put('/:certificateId', authenticate, requireRole('admin'), certificateController.updateCertificate);
router.delete('/:certificateId', authenticate, requireRole('admin'), certificateController.revokeCertificate);

export { router };


