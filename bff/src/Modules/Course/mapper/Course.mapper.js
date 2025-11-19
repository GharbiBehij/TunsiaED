// src/modules/Course/mapper/Course.mapper.js
import { Course } from '../model/entity/Course.entity.js';

export class CourseMapper {
  static toResponse(entity, message) {
    return {
      course: {
        courseId: entity.courseId,
        title: entity.title,
        description: entity.description,
        instructorId: entity.instructorId,
        instructorName: entity.instructorName,
        category: entity.category,
        level: entity.level,
        price: entity.price,
        thumbnail: entity.thumbnail,
        duration: entity.duration,
        enrolledCount: entity.enrolledCount,
        rating: entity.rating,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      },
      message,
    };
  }

  static toEntity(data) {
    return new Course(
      data.courseId,
      data.title,
      data.description,
      data.instructorId,
      data.instructorName,
      data.category,
      data.level,
      data.price,
      data.thumbnail,
      data.duration,
      data.enrolledCount || 0,
      data.rating || 0,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
}

