// Service layer for lesson-related logic.
// Note: Cross-module operations (create/update/delete with course validation) 
// are also available in CourseContent.orchestrator.js for unified access
import { lessonRepository } from '../repository/Lesson.repository.js';
import { chapterRepository } from '../../Chapter/repository/Chapter.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { LessonPermission } from './LessonPermission.js';
import { LessonMapper } from '../mapper/Lesson.mapper.js';
import { CourseMapper } from '../../Course/mapper/Course.mapper.js';

export class LessonService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? LessonMapper.toModel(raw.lessonId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => LessonMapper.toModel(raw.lessonId, raw));
  }

  _toEntity(courseId, chapterId, model) {
    return LessonMapper.toEntity(courseId, chapterId, model);
  }

  _toEntityUpdate(model) {
    return LessonMapper.toEntityUpdate(model);
  }

  _courseToModel(raw) {
    return raw ? CourseMapper.toModel(raw.courseId, raw) : null;
  }

  // Create a new lesson (admin/course owner only)
  async createLesson(courseId, chapterId, user, data) {
    const rawCourse = await courseRepository.findByCourseId(courseId);
    if (!rawCourse) throw new Error('Course not found');
    const chapter = await chapterRepository.findByChapterId(chapterId);
    if (!chapter || chapter.courseId !== courseId) {
      throw new Error('Chapter not found');
    }
    const course = this._courseToModel(rawCourse);
    if (!LessonPermission.create(user, course)) {
      throw new Error('Unauthorized');
    }
    LessonMapper.validateCreate(data);
    const raw = await lessonRepository.createLesson(courseId, chapterId, data);
    return this._toModel(raw);
  }

  // Get a single lesson by ID (public)
  async getLessonById(lessonId) {
    const raw = await lessonRepository.findByLessonId(lessonId);
    return this._toModel(raw);
  }

  // Get all lessons for a chapter (public)
  async getLessonsByChapter(chapterId) {
    const rawList = await lessonRepository.findLessonsByChapter(chapterId);
    return this._toModels(rawList);
  }

  // Get all lessons for a course (public)
  async getLessonsByCourse(courseId) {
    const rawList = await lessonRepository.findLessonsByCourse(courseId);
    return this._toModels(rawList);
  }

  // Get all lessons (public)
  async getAllLessons() {
    const rawList = await lessonRepository.findAllLessons();
    return this._toModels(rawList);
  }

  // Update lesson details (admin/course owner only)
  async updateLesson(lessonId, user, data) {
    const existing = await lessonRepository.findByLessonId(lessonId);
    if (!existing) throw new Error('Lesson not found');
    const rawCourse = await courseRepository.findByCourseId(existing.courseId);
    if (!rawCourse) throw new Error('Course not found');
    const course = this._courseToModel(rawCourse);
    if (!LessonPermission.update(user, course)) {
      throw new Error('Unauthorized');
    }
    const raw = await lessonRepository.updateLesson(lessonId, data);
    return this._toModel(raw);
  }

  // Delete a lesson (admin/course owner only)
  async deleteLesson(lessonId, user) {
    const existing = await lessonRepository.findByLessonId(lessonId);
    if (!existing) throw new Error('Lesson not found');
    const rawCourse = await courseRepository.findByCourseId(existing.courseId);
    if (!rawCourse) throw new Error('Course not found');
    const course = this._courseToModel(rawCourse);
    if (!LessonPermission.delete(user, course)) {
      throw new Error('Unauthorized');
    }
    return lessonRepository.deleteLesson(lessonId);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get lesson by ID (internal - bypasses permission for orchestrator)
   * @param {string} lessonId
   */
  async getLessonByIdInternal(lessonId) {
    const raw = await lessonRepository.findByLessonId(lessonId);
    return this._toModel(raw);
  }

  /**
   * Get lessons by course (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   */
  async getLessonsByCourseInternal(courseId) {
    const rawList = await lessonRepository.findLessonsByCourse(courseId);
    return this._toModels(rawList);
  }

  /**
   * Get lessons by chapter (internal - bypasses permission for orchestrator)
   * @param {string} chapterId
   */
  async getLessonsByChapterInternal(chapterId) {
    const rawList = await lessonRepository.findLessonsByChapter(chapterId);
    return this._toModels(rawList);
  }

  /**
   * Create lesson (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   * @param {string} chapterId
   * @param {Object} data
   */
  async createLessonInternal(courseId, chapterId, data) {
    LessonMapper.validateCreate(data);
    const raw = await lessonRepository.createLesson(courseId, chapterId, data);
    return this._toModel(raw);
  }

  /**
   * Update lesson (internal - bypasses permission for orchestrator)
   * @param {string} lessonId
   * @param {Object} data
   */
  async updateLessonInternal(lessonId, data) {
    const raw = await lessonRepository.updateLesson(lessonId, data);
    return this._toModel(raw);
  }

  /**
   * Delete lesson (internal - bypasses permission for orchestrator)
   * @param {string} lessonId
   */
  async deleteLessonInternal(lessonId) {
    return await lessonRepository.deleteLesson(lessonId);
  }
}
export const lessonService = new LessonService();


