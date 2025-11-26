// Domain entity representing a completion certificate for a course.
export class Certificate {
  constructor(
    certificateId,
    userId,
    courseId,
    issuedAt,
    grade,
    metadata,
    extra = {}
  ) {
    this.certificateId = certificateId;
    this.userId = userId;
    this.courseId = courseId;
    this.issuedAt = issuedAt;
    this.grade = grade ?? null;
    this.metadata = metadata ?? {};

    Object.assign(this, extra);
  }
}


