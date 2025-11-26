// Repository for Chapter domain logic – wraps raw Firestore docs into entities.
import { chapterDao } from '../model/dao/Chapter.dao.js';
import { Chapter } from '../model/entity/Chapter.entity.js';

export class ChapterRepository {
  async createChapter(courseId, data) {
    const raw = await chapterDao.createChapter(courseId, data);
    return new Chapter(
      raw.chapterId,
      raw.courseId,
      raw.title,
      raw.order,
      raw.isPublished,
      raw.duration,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
      raw
    );
  }

  async findByChapterId(chapterId) {
    try {
      const doc = await chapterDao.getChapterById(chapterId);
      if (!doc) return null;
      return new Chapter(
        chapterId,
        doc.courseId,
        doc.title,
        doc.order,
        doc.duration,
        doc.isPublished,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async updateChapter(chapterId, data) {
    try {
      const doc = await chapterDao.updateChapter(chapterId, data);
      if (!doc) return null;
      return new Chapter(
        chapterId,
        doc.courseId,
        doc.title,
        doc.order,
        doc.duration,
        doc.isPublished,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async deleteChapter(chapterId) {
    try {
      await chapterDao.deleteChapter(chapterId);
      return true;
    } catch {
      return false;
    }
  }

  async findChaptersByCourse(courseId) {
    try {
      const docs = await chapterDao.getChaptersByCourse(courseId);
      return docs.map(doc =>
        new Chapter(
          doc.chapterId,
          doc.courseId,
          doc.title,
          doc.order,
          doc.duration,
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

  async findAllChapters() {
    try {
      const docs = await chapterDao.getAllChapters();
      return docs.map(doc =>
        new Chapter(
          doc.chapterId,
          doc.courseId,
          doc.title,
          doc.order,
          doc.duration,
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

export const chapterRepository = new ChapterRepository();


