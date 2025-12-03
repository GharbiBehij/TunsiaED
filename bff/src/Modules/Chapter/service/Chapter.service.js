// Service layer for chapter-related business logic.
// Note: Cross-module operations (create/update/delete with course validation) 
// are also available in CourseContent.orchestrator.js for unified access
import { chapterRepository } from '../repository/Chapter.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { ChapterPermission } from './ChapterPermission.js';
import { ChapterMapper } from '../mapper/Chapter.mapper.js';
import { CourseMapper } from '../../Course/mapper/Course.mapper.js';

export class ChapterService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? ChapterMapper.toModel(raw.chapterId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => ChapterMapper.toModel(raw.chapterId, raw));
  }

  _toEntity(courseId, model) {
    return ChapterMapper.toEntity(courseId, model);
  }

  _toEntityUpdate(model) {
    return ChapterMapper.toEntityUpdate(model);
  }

  _courseToModel(raw) {
    return raw ? CourseMapper.toModel(raw.courseId, raw) : null;
  }
  _courseToEntity(courseId, model) {
    return CourseMapper.toEntity(courseId, model);
  }


  // Create a new chapter (admin/course owner only)
  async createChapter(courseId, user, data) {
    const rawCourse = await courseRepository.findByCourseId(courseId);
    if (!rawCourse) {
      throw new Error('Course not found');
    }
    const course = this._courseToModel(rawCourse);
    if (!ChapterPermission.create(user, course)) {
      throw new Error('Unauthorized');
    }
    ChapterMapper.validateCreate(data);
    const raw = await chapterRepository.createChapter(courseId, data);
    return this._toModel(raw);
  }

  // Get a single chapter by ID (public)
  async getChapterById(chapterId) {
    const raw = await chapterRepository.findByChapterId(chapterId);
    return this._toModel(raw);
  }

  // Get all chapters for a course (public)
  async getChaptersByCourse(courseId) {
    const rawList = await chapterRepository.findChaptersByCourse(courseId);
    return this._toModels(rawList);
  }

  // Get all chapters (public)
  async getAllChapters() {
    const rawList = await chapterRepository.findAllChapters();
    return this._toModels(rawList);
  }

  // Update chapter details (admin/course owner only)
  async updateChapter(chapterId, user, data) {
    if (!ChapterPermission.update(user)) {
      throw new Error('Unauthorized');
    }
    const existing = await chapterRepository.findByChapterId(chapterId);
    if (!existing) throw new Error('Chapter not found');
    const rawCourse = await courseRepository.findByCourseId(existing.courseId);
    if (!rawCourse) throw new Error('Course not found');
    const course = this._courseToModel(rawCourse);
    if (!ChapterPermission.update(user, course)) {
      throw new Error('Unauthorized');
    }
    const raw = await chapterRepository.updateChapter(chapterId, data);
    return this._toModel(raw);
  }

  // Delete a chapter (admin/course owner only)
  async deleteChapter(chapterId, user) {
    if (!ChapterPermission.delete(user)) {
      throw new Error('Unauthorized');
    }
    const existing = await chapterRepository.findByChapterId(chapterId);
    if (!existing) throw new Error('Chapter not found');
    const rawCourse = await courseRepository.findByCourseId(existing.courseId);
    if (!rawCourse) throw new Error('Course not found');
    const course = this._courseToModel(rawCourse);
    if (!ChapterPermission.delete(user, course)) {
      throw new Error('Unauthorized');
    }
    return chapterRepository.deleteChapter(chapterId);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get chapter by ID (internal - bypasses permission for orchestrator)
   * @param {string} chapterId
   */
  async getChapterByIdInternal(chapterId) {
    const raw = await chapterRepository.findByChapterId(chapterId);
    return this._toModel(raw);
  }

  /**
   * Get chapters by course (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   */
  async getChaptersByCourseInternal(courseId) {
    const rawList = await chapterRepository.findChaptersByCourse(courseId);
    return this._toModels(rawList);
  }

  /**
   * Create chapter (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   * @param {Object} data
   */
  async createChapterInternal(courseId, data) {
    ChapterMapper.validateCreate(data);
    const raw = await chapterRepository.createChapter(courseId, data);
    return this._toModel(raw);
  }

  /**
   * Update chapter (internal - bypasses permission for orchestrator)
   * @param {string} chapterId
   * @param {Object} data
   */
  async updateChapterInternal(chapterId, data) {
    const raw = await chapterRepository.updateChapter(chapterId, data);
    return this._toModel(raw);
  }

  /**
   * Delete chapter (internal - bypasses permission for orchestrator)
   * @param {string} chapterId
   */
  async deleteChapterInternal(chapterId) {
    return await chapterRepository.deleteChapter(chapterId);
  }
}
export const chapterService = new ChapterService();


