// Repository for Lesson domain logic.
import { lessonDao } from '../model/dao/Lesson.dao.js';
import { Lesson } from '../model/entity/Lesson.entity.js';

export class LessonRepository {
  async createLesson(courseId, chapterId, data) {
    const raw = await lessonDao.createLesson(courseId, chapterId, data);
    return new Lesson(
      raw.lessonId,
      raw.chapterId,
      raw.courseId,
      raw.title,
      raw.order,
      raw.durationMinutes,
      raw.isPublished,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
      raw
    );
  }

  async findByLessonId(lessonId) {
    try {
      const doc = await lessonDao.getLessonById(lessonId);
      if (!doc) return null;
      return new Lesson(
        lessonId,
        doc.chapterId,
        doc.courseId,
        doc.title,
        doc.order,
        doc.durationMinutes,
        doc.isPublished,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async updateLesson(lessonId, data) {
    try {
      const doc = await lessonDao.updateLesson(lessonId, data);
      if (!doc) return null;
      return new Lesson(
        lessonId,
        doc.chapterId,
        doc.courseId,
        doc.title,
        doc.order,
        doc.durationMinutes,
        doc.isPublished,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async deleteLesson(lessonId) {
    try {
      await lessonDao.deleteLesson(lessonId);
      return true;
    } catch {
      return false;
    }
  }

  async findLessonsByChapter(chapterId) {
    try {
      const docs = await lessonDao.getLessonsByChapter(chapterId);
      return docs.map(doc =>
        new Lesson(
          doc.lessonId,
          doc.chapterId,
          doc.courseId,
          doc.title,
          doc.order,
          doc.durationMinutes,
          doc.isPublished,
          new Date(doc.createdAt),
          new Date(doc.updatedAt),
          doc
        )
      );
    } catch {
      return [];
    }
  }

  async findLessonsByCourse(courseId) {
    try {
      const docs = await lessonDao.getLessonsByCourse(courseId);
      return docs.map(doc =>
        new Lesson(
          doc.lessonId,
          doc.chapterId,
          doc.courseId,
          doc.title,
          doc.order,
          doc.durationMinutes,
          doc.isPublished,
          new Date(doc.createdAt),
          new Date(doc.updatedAt),
          doc
        )
      );
    } catch {
      return [];
    }
  }

  async findAllLessons() {
    try {
      const docs = await lessonDao.getAllLessons();
      return docs.map(doc =>
        new Lesson(
          doc.lessonId,
          doc.chapterId,
          doc.courseId,
          doc.title,
          doc.order,
          doc.durationMinutes,
          doc.isPublished,
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

export const lessonRepository = new LessonRepository();


