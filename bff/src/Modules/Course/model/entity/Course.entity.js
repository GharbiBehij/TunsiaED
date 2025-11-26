// Domain entity representing a course record coming from Firestore.
export class Course {
  constructor(
    courseId,
    title,
    description,
    instructorId,
    instructorName,
    category,
    level,
    price,
    thumbnail,
    duration,
    enrolledCount,
    rating,
    createdAt,
    updatedAt,
    extra = {}
  ) {
    this.courseId = courseId;
    this.title = title;
    this.description = description;
    this.instructorId = instructorId;
    this.instructorName = instructorName;
    this.category = category;
    this.level = level;
    this.price = price;
    this.thumbnail = thumbnail ?? null;
    this.duration = duration ?? null;
    this.enrolledCount = enrolledCount ?? 0;
    this.rating = rating ?? 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    // Allow additional fields (e.g., published flag) without breaking callers.
    Object.assign(this, extra);
  }
}


