// Domain entity representing a lesson within a chapter.
export class Lesson {
  constructor(
    lessonId,
    chapterId,
    courseId,
    title,
    order,
    durationMinutes,
    isPublished,
    createdAt,
    updatedAt,
    extra = {}
  ) {
    this.lessonId = lessonId;
    this.chapterId = chapterId;
    this.courseId = courseId;
    this.title = title;
    this.order = order ?? 0;
    this.durationMinutes = durationMinutes ?? null;
    this.isPublished = isPublished ?? false;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    Object.assign(this, extra);
  }
}


