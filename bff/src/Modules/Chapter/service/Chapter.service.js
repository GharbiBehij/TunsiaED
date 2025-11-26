// Service layer for chapter-related business logic.
import { chapterRepository } from '../repository/Chapter.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { canCreateChapter, canUpdateChapter, canDeleteChapter } from './ChapterPermission.js';

export class ChapterService {
  async createChapter(courseId, user, data) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (!canCreateChapter(user, course)) {
      throw new Error('Unauthorized');
    }

    return chapterRepository.createChapter(courseId, data);
  }

  async getChapterById(chapterId) {
    return chapterRepository.findByChapterId(chapterId);
  }

  async getChaptersByCourse(courseId) {
    return chapterRepository.findChaptersByCourse(courseId);
  }

  async getAllChapters() {
    return chapterRepository.findAllChapters();
  }

  async updateChapter(chapterId, user, data) {
    const existing = await chapterRepository.findByChapterId(chapterId);
    if (!existing) throw new Error('Chapter not found');

    const course = await courseRepository.findByCourseId(existing.courseId);
    if (!course) throw new Error('Course not found');

    if (!canUpdateChapter(user, course)) {
      throw new Error('Unauthorized');
    }

    return chapterRepository.updateChapter(chapterId, data);
  }

  async deleteChapter(chapterId, user) {
    const existing = await chapterRepository.findByChapterId(chapterId);
    if (!existing) throw new Error('Chapter not found');

    const course = await courseRepository.findByCourseId(existing.courseId);
    if (!course) throw new Error('Course not found');

    if (!canDeleteChapter(user, course)) {
      throw new Error('Unauthorized');
    }

    return chapterRepository.deleteChapter(chapterId);
  }
}

export const chapterService = new ChapterService();


