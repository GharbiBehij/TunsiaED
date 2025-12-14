// Controllers for Certificate HTTP endpoints.
// Uses orchestrators for cross-module operations
import { certificateService } from '../service/Certificate.service.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { userService } from '../../User/service/User.service.js';
import { certificateGrantingOrchestrator } from '../../../orchestrators/CertificateGranting.orchestrator.js';

/**
 * Issue certificate (direct service call)
 * Single module operation
 */
export const issueCertificate = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const cert = await certificateService.issueCertificate(userId, courseId, req.body);
    res.status(201).json(cert);
  } catch (err) {
    if (err.message === 'Course not found' || err.message === 'User is not enrolled in this course') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.uid;
    const certs = await certificateService.getUserCertificates(userId);
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await certificateService.getCertificateById(certificateId);
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseCertificates = async (req, res) => {
  try {
    const { courseId } = req.params;
    const certs = await certificateService.getCourseCertificates(courseId);
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const certs = await certificateService.getAllCertificates();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const updated = await certificateService.updateCertificate(certificateId, user, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Update failed' });
    }
    res.json(updated);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    await certificateService.revokeCertificate(certificateId, user);
    res.json({ message: 'Certificate revoked successfully' });
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
}
    /**
 * 
 * ORCHESTRATED ENDPOINTS - Cross-module operations
 */

/**
 * Grant certificate based on course completion
 * ORCHESTRATOR: Validates completion via Progress module and issues certificate
 * Cross-module: Certificate + Progress + Enrollment + Course modules
 */
export const grantCertificate = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { courseId, enrollmentId, grade } = req.body;

    if (!courseId || !enrollmentId) {
      return res.status(400).json({ error: 'courseId and enrollmentId are required' });
    }

    // Use orchestrator for cross-module certificate granting
    const certificate = await certificateGrantingOrchestrator.grantCertificate(user, {
      userId: user.uid,
      courseId,
      enrollmentId,
      grade,
    });

    res.status(201).json(certificate);
  } catch (err) {
    if (err.message.includes('not completed') || err.message.includes('already issued')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Check certificate eligibility
 * ORCHESTRATOR: Checks if student can receive certificate based on progress
 * Cross-module: Certificate + Progress + Enrollment modules
 */
export const checkEligibility = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userService.getUserByUidInternal(userId);
    const { courseId } = req.params;

    // Use orchestrator to check eligibility
    const eligibility = await certificateGrantingOrchestrator.checkCertificateEligibility(user, courseId);
    res.status(200).json(eligibility);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Auto-grant certificates for completed courses
 * ORCHESTRATOR: Batch process for granting certificates
 * Cross-module: Certificate + Progress + Enrollment modules
 * Admin only
 */
export const autoGrantCertificates = async (req, res) => {
  try {
    const adminUserId = req.user.uid;
    const user = await userRepository.findByUid(adminUserId);
    const { userId } = req.body; // Target user ID (optional)

    // Use orchestrator for batch certificate granting
    const result = await certificateGrantingOrchestrator.autoGrantCertificates(user, userId || null);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message.includes('not implemented')) {
      return res.status(501).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const certificateController = {
  // Direct service calls (single module)
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  getCourseCertificates,
  getAllCertificates,
  updateCertificate,
  revokeCertificate,
  // Orchestrated endpoints (cross-module)
  grantCertificate,
  checkEligibility,
  autoGrantCertificates,
};

