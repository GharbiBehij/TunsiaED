// Domain entity representing an enrollment record.
export class Enrollment {
  constructor(
    enrollmentId,
    userId,
    courseId,
    enrollmentDate,
    status,
    paymentId,
    transactionId,
    extra = {}
  ) {
    this.enrollmentId = enrollmentId;
    this.userId = userId;
    this.courseId = courseId;
    this.enrollmentDate = enrollmentDate;
    this.status = status;
    this.paymentId = paymentId ?? null;
    this.transactionId = transactionId ?? null;

    Object.assign(this, extra);
  }
}


