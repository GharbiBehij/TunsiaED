// src/modules/Enrollement/mapper/Enrollement.mapper.js
import { Enrollment } from '../model/entity/Enrollement.entity.js';

export class EnrollmentMapper {
  static toResponse(entity, message) {
    return {
      enrollment: {
        enrollmentId: entity.enrollmentId,
        userId: entity.userId,
        courseId: entity.courseId,
        enrollmentDate: entity.enrollmentDate.toISOString(),
        status: entity.status,
        paymentId: entity.paymentId,
        transactionId: entity.transactionId,
      },
      message,
    };
  }

  static toEntity(data) {
    return new Enrollment(
      data.enrollmentId,
      data.userId,
      data.courseId,
      new Date(data.enrollmentDate),
      data.status,
      data.paymentId,
      data.transactionId
    );
  }
}

