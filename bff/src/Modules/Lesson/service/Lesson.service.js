// Service layer for lesson-related logic.
import { lessonRepository } from '../repository/Lesson.repository.js';
import { chapterRepository } from '../../Chapter/repository/Chapter.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { canCreateLesson, canUpdateLesson, canDeleteLesson } from './LessonPermission.js';

export class LessonService {
  async createLesson(courseId, chapterId, user, data) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) throw new Error('Course not found');

    const chapter = await chapterRepository.findByChapterId(chapterId);
    if (!chapter || chapter.courseId !== courseId) {
      throw new Error('Chapter not found');
    }

    if (!canCreateLesson(user, course)) {
      throw new Error('Unauthorized');
    }

    return lessonRepository.createLesson(courseId, chapterId, data);
  }

  async getLessonById(lessonId) {
    return lessonRepository.findByLessonId(lessonId);
  }

  async getLessonsByChapter(chapterId) {
    return lessonRepository.findLessonsByChapter(chapterId);
  }

  async getLessonsByCourse(courseId) {
    return lessonRepository.findLessonsByCourse(courseId);
  }

  async getAllLessons() {
    return lessonRepository.findAllLessons();
  }

  async updateLesson(lessonId, user, data) {
    const existing = await lessonRepository.findByLessonId(lessonId);
    if (!existing) throw new Error('Lesson not found');

    const course = await courseRepository.findByCourseId(existing.courseId);
    if (!course) throw new Error('Course not found');

    if (!canUpdateLesson(user, course)) {
      throw new Error('Unauthorized');
    }

    return lessonRepository.updateLesson(lessonId, data);
  }

  async deleteLesson(lessonId, user) {
    const existing = await lessonRepository.findByLessonId(lessonId);
    if (!existing) throw new Error('Lesson not found');

    const course = await courseRepository.findByCourseId(existing.courseId);
    if (!course) throw new Error('Course not found');

    if (!canDeleteLesson(user, course)) {
      throw new Error('Unauthorized');
    }

    return lessonRepository.deleteLesson(lessonId);
  }
}

export const lessonService = new LessonService();


