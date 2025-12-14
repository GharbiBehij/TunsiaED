import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { certificateController } from './Certificate.controller.js';

const router = Router();

// DIRECT SERVICE ROUTES - Single module operations
// IMPORTANT: Specific routes must come BEFORE parameterized routes

// Admin-only aggregate endpoints - MUST be first
router.get('/', authenticate, requireRole('admin'), certificateController.getAllCertificates);

// Authenticated user: own certificates - MUST come before /:certificateId
router.get('/me', authenticate, certificateController.getMyCertificates);

// List certificates by course - MUST come before /:certificateId
router.get('/course/:courseId', authenticate, requireRole('admin', 'instructor'), certificateController.getCourseCertificates);

// Authenticated user can issue certificate for themselves (guarded in service)
router.post('/', authenticate, certificateController.issueCertificate);

// Authenticated read of a specific certificate (ownership verified in controller)
// MUST come AFTER specific routes like /me, /course/:courseId
router.get('/:certificateId', authenticate, certificateController.getCertificateById);

// Admin-only update/delete
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


