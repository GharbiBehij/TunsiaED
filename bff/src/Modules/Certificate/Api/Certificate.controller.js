// Controllers for Certificate HTTP endpoints.
import { certificateService } from '../service/Certificate.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

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
    const user = await userRepository.findByUid(userId);
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
    const user = await userRepository.findByUid(userId);
    await certificateService.revokeCertificate(certificateId, user);
    res.json({ message: 'Certificate revoked successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const certificateController = {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  getCourseCertificates,
  getAllCertificates,
  updateCertificate,
  revokeCertificate,
};


