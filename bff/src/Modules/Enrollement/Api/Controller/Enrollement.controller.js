// bff/src/Modules/Enrollement/Api/Controller/Enrollement.controller.js
// DIRECT operations use enrollmentService (single module)
// ORCHESTRATED operations use enrollmentOrchestrator (cross-module)
import { enrollmentService } from '../../service/Enrollement.service.js';
import { userRepository } from '../../../User/repository/User.repository.js';
import { userService } from '../../../User/service/User.service.js';
import { enrollmentOrchestrator } from '../../../../orchestrators/Enrollment.orchestrator.js';

export class EnrollmentController {
  /**
   * Enroll user in a course
   * ORCHESTRATED: Enrollment + Course + Progress
   */
  async enroll(req, res) {
    const requestId = `ENR_${Date.now()}`;
    console.log(`📝 [${requestId}] Enrollment request:`, {
      courseId: req.body.courseId,
      userId: req.user?.uid
    });

    try {
      const userId = req.user?.uid;
      if (!userId) {
        console.log(`⛔ [${requestId}] Authentication required`);
        return res.status(401).json({ error: 'Authentication required' });
      }

      console.log(`🔄 [${requestId}] Calling enrollment orchestrator...`);
      const result = await enrollmentOrchestrator.enroll(userId, req.body);
      console.log(`✅ [${requestId}] Enrollment created:`, result.enrollmentId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to enroll' });
    }
  }

  /**
   * Get user's enrollments
   * DIRECT: Single module operation
   */
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

  /**
   * Get enrollment by ID
   * DIRECT: Single module operation
   */
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

  /**
   * Get students enrolled in a course (instructor view)
   * ORCHESTRATED: Enrollment + Course
   */
  async getStudentsForCourse(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user.uid;
      const user = await userService.getUserByUidInternal(userId);
  
      const students = await enrollmentOrchestrator.getStudentsForCourse(courseId, user);
      res.json(students);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

  /**
   * Get course enrollments with progress (for instructors)
   * ORCHESTRATED: Enrollment + Progress + User + Course
   */
  async getCourseEnrollmentsWithProgress(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user.uid;
      const user = await userService.getUserByUidInternal(userId);

      const enrollments = await enrollmentOrchestrator.getCourseEnrollmentsWithProgress(courseId, user);
      res.status(200).json({ enrollments });
    } catch (error) {
      res.status(403).json({ error: error.message || 'Failed to fetch course progress' });
    }
  }

  /**
   * Get single enrollment with progress details
   * ORCHESTRATED: Enrollment + Progress
   */
  async getEnrollmentWithProgress(req, res) {
    try {
      const { enrollmentId } = req.params;
      const enrollment = await enrollmentOrchestrator.getEnrollmentWithProgress(enrollmentId);
      
      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      res.status(200).json(enrollment);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch enrollment progress' });
    }
  }
}

export const enrollmentController = new EnrollmentController();
