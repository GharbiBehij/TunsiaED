// src/modules/Course/repository/Course.repository.js
import { courseDao } from '../model/dao/Course.dao.js';
import { Course } from '../model/entity/Course.entity.js';

export class CourseRepository {
  async createCourse(instructorId, instructorName, data) {
    const raw = await courseDao.createCourse(instructorId, instructorName, data);

    return new Course(
      raw.courseId,
      raw.title,
      raw.description,
      raw.instructorId,
      raw.instructorName,
      raw.category,
      raw.level,
      raw.price,
      raw.thumbnail || undefined,
      raw.duration,
      raw.enrolledCount || 0,
      raw.rating || 0,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
      raw
    );
  }

  async findByCourseId(courseId) {
    try {
      const doc = await courseDao.getCourseById(courseId);
      if (!doc) return null;

      return new Course(
        courseId,
        doc.title,
        doc.description,
        doc.instructorId,
        doc.instructorName,
        doc.category,
        doc.level,
        doc.price,
        doc.thumbnail,
        doc.duration,
        doc.enrolledCount || 0,
        doc.rating || 0,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async updateCourse(courseId, data) {
    try {
      const doc = await courseDao.updateCourse(courseId, data);
      if (!doc) return null;

      return new Course(
        courseId,
        doc.title,
        doc.description,
        doc.instructorId,
        doc.instructorName,
        doc.category,
        doc.level,
        doc.price,
        doc.thumbnail,
        doc.duration,
        doc.enrolledCount || 0,
        doc.rating || 0,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async deleteCourse(courseId) {
    try {
      await courseDao.deleteCourse(courseId);
      return true;
    } catch {
      return false;
    }
  }

  async findCoursesByInstructor(instructorId) {
    try {
      const docs = await courseDao.getCoursesByInstructor(instructorId);
      return docs.map((doc) =>
        new Course(
          doc.courseId,
          doc.title,
          doc.description,
          doc.instructorId,
          doc.instructorName,
          doc.category,
          doc.level,
          doc.price,
          doc.thumbnail,
          doc.duration,
          doc.enrolledCount || 0,
          doc.rating || 0,
          new Date(doc.createdAt),
          new Date(doc.updatedAt),
          doc
        )
      );
    } catch {
      return [];
    }
  }

  async findAllCourses() {
    try {
      const docs = await courseDao.getAllCourses();
      return docs.map((doc) =>
        new Course(
          doc.courseId,
          doc.title,
          doc.description,
          doc.instructorId,
          doc.instructorName,
          doc.category,
          doc.level,
          doc.price,
          doc.thumbnail,
          doc.duration,
          doc.enrolledCount || 0,
          doc.rating || 0,
          new Date(doc.createdAt),
          new Date(doc.updatedAt),
          doc
        )
      );
    } catch {
      return [];
    }
  }

  async findCoursesByCategory(category) {
    try {
      const docs = await courseDao.getCoursesByCategory(category);
      return docs.map((doc) =>
        new Course(
          doc.courseId,
          doc.title,
          doc.description,
          doc.instructorId,
          doc.instructorName,
          doc.category,
          doc.level,
          doc.price,
          doc.thumbnail,
          doc.duration,
          doc.enrolledCount || 0,
          doc.rating || 0,
          new Date(doc.createdAt),
          new Date(doc.updatedAt),
          doc
        )
      );
    } catch {
      return [];
    }
  }
}

export const courseRepository = new CourseRepository();

