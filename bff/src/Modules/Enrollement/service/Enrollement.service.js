// src/modules/Enrollement/service/Enrollement.service.js
import { enrollmentRepository } from '../Repository/Enrollement.repository.js';
import { EnrollmentMapper } from '../mapper/Enrollement.mapper.js';

export class EnrollmentService {
  async enroll(userId, data) {
    // Check if user is already enrolled in this course
    const alreadyEnrolled = await enrollmentRepository.checkUserEnrollment(
      userId,
      data.courseId
    );

    if (alreadyEnrolled) {
      throw new Error('User is already enrolled in this course');
    }

    // TODO: Validate course exists (will be added when Course module is ready)
    // TODO: Handle payment based on paymentType (individual vs subscription)
    // TODO: Create payment and transaction records

    // For now, create enrollment without payment (will be linked later)
    const enrollment = await enrollmentRepository.createEnrollment(userId, data);

    return EnrollmentMapper.toResponse(enrollment, 'Enrollment successful');
  }

  async getUserEnrollments(userId) {
    const enrollments = await enrollmentRepository.findUserEnrollments(userId);
    return enrollments.map((enrollment) =>
      EnrollmentMapper.toResponse(enrollment, 'Enrollment retrieved')
    );
  }

  async getEnrollmentById(enrollmentId) {
    const enrollment = await enrollmentRepository.findByEnrollmentId(enrollmentId);
    if (!enrollment) return null;

    return EnrollmentMapper.toResponse(enrollment, 'Enrollment retrieved');
  }
}

export const enrollmentService = new EnrollmentService();

