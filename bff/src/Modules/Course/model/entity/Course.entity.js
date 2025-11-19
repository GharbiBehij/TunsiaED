// src/modules/Course/model/entity/Course.entity.js
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
    duration = 0,
    enrolledCount = 0,
    rating = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    this.courseId = courseId;
    this.title = title;
    this.description = description;
    this.instructorId = instructorId;
    this.instructorName = instructorName;
    this.category = category;
    this.level = level;
    this.price = price;
    this.thumbnail = thumbnail;
    this.duration = duration;
    this.enrolledCount = enrolledCount;
    this.rating = rating;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
