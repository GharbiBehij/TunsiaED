// Service layer for quiz-related logic.
// Note: Cross-module operations (create/update/delete with course validation) 
// are also available in CourseContent.orchestrator.js for unified access
import { quizRepository } from '../repository/Quiz.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { lessonRepository } from '../../Lesson/repository/Lesson.repository.js';
import { QuizPermission } from './QuizPermission.js';
import { QuizMapper } from '../mapper/Quiz.mapper.js';
import { CourseMapper } from '../../Course/mapper/Course.mapper.js';

export class QuizService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? QuizMapper.toModel(raw.quizId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => QuizMapper.toModel(raw.quizId, raw));
  }

  _toEntity(courseId, lessonId, model) {
    return QuizMapper.toEntity(courseId, lessonId, model);
  }

  _toEntityUpdate(model) {
    return QuizMapper.toEntityUpdate(model);
  }

  _courseToModel(raw) {
    return raw ? CourseMapper.toModel(raw.courseId, raw) : null;
  }

  // Create a new quiz (admin/course owner only)
  async createQuiz(courseId, lessonId, user, data) {
    const rawCourse = await courseRepository.findByCourseId(courseId);
    if (!rawCourse) throw new Error('Course not found');
    if (lessonId) {
      const lesson = await lessonRepository.findByLessonId(lessonId);
      if (!lesson || lesson.courseId !== courseId) {
        throw new Error('Lesson not found');
      }
    }
    const course = this._courseToModel(rawCourse);
    if (!QuizPermission.create(user, course)) {
      throw new Error('Unauthorized');
    }
    QuizMapper.validateCreate(data);
    const raw = await quizRepository.createQuiz(courseId, lessonId, data);
    return this._toModel(raw);
  }

  // Get a single quiz by ID (public)
  async getQuizById(quizId) {
    const raw = await quizRepository.findByQuizId(quizId);
    return this._toModel(raw);
  }

  // Get all quizzes for a course (public)
  async getQuizzesByCourse(courseId) {
    const rawList = await quizRepository.findQuizzesByCourse(courseId);
    return this._toModels(rawList);
  }

  // Get all quizzes for a lesson (public)
  async getQuizzesByLesson(lessonId) {
    const rawList = await quizRepository.findQuizzesByLesson(lessonId);
    return this._toModels(rawList);
  }

  // Get all quizzes (public)
  async getAllQuizzes() {
    const rawList = await quizRepository.findAllQuizzes();
    return this._toModels(rawList);
  }

  // Update quiz details (admin/course owner only)
  async updateQuiz(quizId, user, data) {
    const existing = await quizRepository.findByQuizId(quizId);
    if (!existing) throw new Error('Quiz not found');
    const rawCourse = await courseRepository.findByCourseId(existing.courseId);
    if (!rawCourse) throw new Error('Course not found');
    const course = this._courseToModel(rawCourse);
    if (!QuizPermission.update(user, course)) {
      throw new Error('Unauthorized');
    }
    const raw = await quizRepository.updateQuiz(quizId, data);
    return this._toModel(raw);
  }

  // Delete a quiz (admin/course owner only)
  async deleteQuiz(quizId, user) {
    const existing = await quizRepository.findByQuizId(quizId);
    if (!existing) throw new Error('Quiz not found');
    const rawCourse = await courseRepository.findByCourseId(existing.courseId);
    if (!rawCourse) throw new Error('Course not found');
    const course = this._courseToModel(rawCourse);
    if (!QuizPermission.delete(user, course)) {
      throw new Error('Unauthorized');
    }
    return quizRepository.deleteQuiz(quizId);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get quiz by ID (internal - bypasses permission for orchestrator)
   * @param {string} quizId
   */
  async getQuizByIdInternal(quizId) {
    const raw = await quizRepository.findByQuizId(quizId);
    return this._toModel(raw);
  }

  /**
   * Get quizzes by course (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   */
  async getQuizzesByCourseInternal(courseId) {
    const rawList = await quizRepository.findQuizzesByCourse(courseId);
    return this._toModels(rawList);
  }

  /**
   * Get quizzes by lesson (internal - bypasses permission for orchestrator)
   * @param {string} lessonId
   */
  async getQuizzesByLessonInternal(lessonId) {
    const rawList = await quizRepository.findQuizzesByLesson(lessonId);
    return this._toModels(rawList);
  }

  /**
   * Create quiz (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   * @param {string|null} lessonId
   * @param {Object} data
   */
  async createQuizInternal(courseId, lessonId, data) {
    QuizMapper.validateCreate(data);
    const raw = await quizRepository.createQuiz(courseId, lessonId, data);
    return this._toModel(raw);
  }

  /**
   * Update quiz (internal - bypasses permission for orchestrator)
   * @param {string} quizId
   * @param {Object} data
   */
  async updateQuizInternal(quizId, data) {
    const raw = await quizRepository.updateQuiz(quizId, data);
    return this._toModel(raw);
  }

  /**
   * Delete quiz (internal - bypasses permission for orchestrator)
   * @param {string} quizId
   */
  async deleteQuizInternal(quizId) {
    return await quizRepository.deleteQuiz(quizId);
  }
}
export const quizService = new QuizService();


