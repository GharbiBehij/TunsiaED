// Repository for Lesson domain logic.
import { lessonDao } from '../model/dao/Lesson.dao.js';

export class LessonRepository {
  // Create lesson via DAO
  async createLesson(courseId, chapterId, data) {
    return await lessonDao.createLesson(courseId, chapterId, data);
  }

  // Find a lesson by ID via DAO
  async findByLessonId(lessonId) {
    try {
      const doc = await lessonDao.getLessonById(lessonId);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Update lesson via DAO
  async updateLesson(lessonId, data) {
    try {
      const doc = await lessonDao.updateLesson(lessonId, data);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Delete lesson via DAO
  async deleteLesson(lessonId) {
    try {
      await lessonDao.deleteLesson(lessonId);
      return true;
    } catch {
      return false;
    }
  }

  // Find all lessons by chapter via DAO
  async findLessonsByChapter(chapterId) {
    try {
      const docs = await lessonDao.getLessonsByChapter(chapterId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all lessons by course via DAO
  async findLessonsByCourse(courseId) {
    try {
      const docs = await lessonDao.getLessonsByCourse(courseId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all lessons via DAO
  async findAllLessons() {
    try {
      const docs = await lessonDao.getAllLessons();
      return docs;
    } catch {
      return [];
    }
  }
}

export const lessonRepository = new LessonRepository();


