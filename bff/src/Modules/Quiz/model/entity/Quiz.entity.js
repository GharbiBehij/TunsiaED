// Domain entity representing a quiz attached to a lesson or course.
export class Quiz {
  constructor(
    quizId,
    courseId,
    lessonId,
    title,
    totalQuestions,
    passingScore,
    isPublished,
    createdAt,
    updatedAt,
    extra = {}
  ) {
    this.quizId = quizId;
    this.courseId = courseId;
    this.lessonId = lessonId ?? null;
    this.title = title;
    this.totalQuestions = totalQuestions ?? 0;
    this.passingScore = passingScore ?? 0;
    this.isPublished = isPublished ?? false;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    Object.assign(this, extra);
  }
}


