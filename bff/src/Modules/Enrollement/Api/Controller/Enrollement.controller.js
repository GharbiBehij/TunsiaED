// src/modules/Enrollement/Api/Enrollement.controller.js
import { enrollmentService } from '../../service/Enrollement.service.js';

export class EnrollmentController {
  async enroll(req, res) {
    try {
      // userId comes from auth middleware
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const result = await enrollmentService.enroll(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to enroll' });
    }
  }

  async getUserEnrollments(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const enrollments = await enrollmentService.getUserEnrollments(userId);
      res.status(200).json({ enrollments });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch enrollments' });
    }
  }

  async getEnrollmentById(req, res) {
    try {
      const { enrollmentId } = req.params;
      const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
      
      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      res.status(200).json(enrollment);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch enrollment' });
    }
  }
}

export const enrollmentController = new EnrollmentController();

