// Repository for Chapter domain logic.
import { chapterDao } from '../model/dao/Chapter.dao.js';

export class ChapterRepository {
  // Create chapter via DAO
  async createChapter(courseId, data) {
    return await chapterDao.createChapter(courseId, data);
  }

  // Find a chapter by ID via DAO
  async findByChapterId(chapterId) {
    try {
      const doc = await chapterDao.getChapterById(chapterId);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Update chapter via DAO
  async updateChapter(chapterId, data) {
    try {
      const doc = await chapterDao.updateChapter(chapterId, data);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Delete chapter via DAO
  async deleteChapter(chapterId) {
    try {
      await chapterDao.deleteChapter(chapterId);
      return true;
    } catch {
      return false;
    }
  }

  // Find all chapters by course via DAO
  async findChaptersByCourse(courseId) {
    try {
      const docs = await chapterDao.getChaptersByCourse(courseId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all chapters via DAO
  async findAllChapters() {
    try {
      const docs = await chapterDao.getAllChapters();
      return docs
    } catch {
      return [];
    }
  }
}

export const chapterRepository = new ChapterRepository();


