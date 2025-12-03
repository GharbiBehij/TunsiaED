import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { certificateController } from './Certificate.controller.js';

const router = Router();

// DIRECT SERVICE ROUTES - Single module operations
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

// ORCHESTRATED ROUTES - Cross-module certificate granting
// Grant certificate orchestrator - validates completion and issues certificate
router.post('/grant', authenticate, certificateController.grantCertificate);
// Check eligibility orchestrator - checks if student can receive certificate
router.get('/eligibility/:courseId', authenticate, certificateController.checkEligibility);
// Auto-grant orchestrator - batch process for completed courses (admin only)
router.post('/auto-grant', authenticate, requireRole('admin'), certificateController.autoGrantCertificates);

export { router };


