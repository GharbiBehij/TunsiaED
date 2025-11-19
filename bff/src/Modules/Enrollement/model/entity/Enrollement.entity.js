// src/modules/Enrollement/model/Enrollement.entity.js
export class Enrollment {
  constructor(
    enrollmentId,
    userId,
    courseId,
    enrollmentDate,
    status,
    paymentId,
    transactionId
  ) {
    this.enrollmentId = enrollmentId;
    this.userId = userId;
    this.courseId = courseId;
    this.enrollmentDate = enrollmentDate;
    this.status = status;
    this.paymentId = paymentId;
    this.transactionId = transactionId;
  }
}
