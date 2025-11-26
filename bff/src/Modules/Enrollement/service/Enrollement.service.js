// src/modules/Enrollment/service/Enrollment.service.js
import { userRepository } from '../../User/repository/User.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js'; // ← ADD THIS
import { enrollmentRepository } from '../repository/Enrollment.repository.js';
import { canViewCourseStudents } from './EnrollmentPermission.js';

export class EnrollmentService {
  async enroll(userId, data) {
    // 1. Check if user is already enrolled
    const alreadyEnrolled = await enrollmentRepository.checkUserEnrollment(
      userId,
      data.courseId
    );
    if (alreadyEnrolled) {
      throw new Error('You are already enrolled in this course');
    }

    // 2. Validate that the course actually exists and is published
    const course = await courseRepository.findByCourseId(data.courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    if (course.isPublished === false) {
      throw new Error('This course is not available yet');
    }
    if (course.price > 0 && !data.paymentId) {
      throw new Error('Payment required for this course');
    }

    // 3. TODO: Validate payment exists (when Paymee is ready)
    // if (course.price > 0) {
    //   const payment = await paymentRepository.findById(data.paymentId);
    //   if (!payment || payment.status !== 'completed') throw new Error('Invalid payment');
    // }

    // 4. Create enrollment
    const enrollment = await enrollmentRepository.createEnrollment(userId, {
      courseId: data.courseId,
      courseTitle: course.title,
      instructorId: course.instructorId,
      pricePaid: course.price,
      enrolledAt: new Date(),
      progress: 0,
      completed: false
    });

    return enrollment;
  }

  async getUserEnrollments(userId) {
    return await enrollmentRepository.findUserEnrollments(userId);
  }

  async getEnrollmentById(enrollmentId) {
    return await enrollmentRepository.findByEnrollmentId(enrollmentId);
  }
  async getStudentsForCourse(courseId, user) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    
    if (!canViewCourseStudents(user, course)) {
      throw new Error("Unauthorized");
    }
    
    return await enrollmentRepository.getCourseEnrollments(courseId);
  }
}

export const enrollmentService = new EnrollmentService();