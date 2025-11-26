// Domain entity representing a chapter within a course.
export class Chapter {
  constructor(
    chapterId,
    courseId,
    title,
    order,
    isPublished,
    createdAt,
    updatedAt,
    extra = {}
  ) {
    this.chapterId = chapterId;
    this.courseId = courseId;
    this.title = title;
    this.order = order ?? 0;
    this.isPublished = isPublished ?? false;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    Object.assign(this, extra);
  }
}


