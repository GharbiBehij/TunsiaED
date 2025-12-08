// Course Content Orchestrator
// Orchestrates cross-module operations for course content (Chapter, Lesson, Quiz)
// Centralizes course ownership validation pattern

import { courseService } from '../Modules/Course/service/Course.service.js';
import { chapterService } from '../Modules/Chapter/service/Chapter.service.js';
import { lessonService } from '../Modules/Lesson/service/Lesson.service.js';
import { quizService } from '../Modules/Quiz/service/Quiz.service.js';
import { ChapterPermission } from '../Modules/Chapter/service/ChapterPermission.js';
import { LessonPermission } from '../Modules/Lesson/service/LessonPermission.js';
import { QuizPermission } from '../Modules/Quiz/service/QuizPermission.js';
import { cacheClient } from '../core/cache/cacheClient.js';

export class CourseContentOrchestrator {
  // ====================================================================
  // SHARED VALIDATION HELPERS
  // ====================================================================

  /**
   * Get course and validate it exists
   * @param {string} courseId - Course ID
   * @returns {{Promise<Object>}} Course model
   */
  async _getCourseOrThrow(courseId) {
    const course = await courseService.getCourseByIdInternal(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  /**
   * Get chapter and validate it belongs to course
   * @param {string} chapterId - Chapter ID
   * @param {string} courseId - Course ID
   * @returns {{Promise<Object>}} Chapter model
   */
  async _getChapterOrThrow(chapterId, courseId) {
    const chapter = await chapterService.getChapterByIdInternal(chapterId);
    if (!chapter || chapter.courseId !== courseId) {
      throw new Error('Chapter not found');
    }
    return chapter;
  }

  /**
   * Get lesson and validate it belongs to course
   * @param {string} lessonId - Lesson ID
   * @param {string} courseId - Course ID (optional, for validation)
   * @returns {Object} Lesson model
   */
  async _getLessonOrThrow(lessonId, courseId = null) {
    const lesson = await lessonService.getLessonByIdInternal(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    if (courseId && lesson.courseId !== courseId) {
      throw new Error('Lesson not found');
    }
    return lesson;
  }

  // ====================================================================
  // CHAPTER OPERATIONS (Chapter + Course)
  // ====================================================================

  /**
   * Create chapter with course validation
   * Cross-module: Chapter + Course
   * @param {string} courseId - Course ID
   * @param {Object} user - Authenticated user
   * @param {Object} data - Chapter data
   * @returns {{Promise<Object>}} Chapter DTO
   */
  async createChapter(courseId, user, data) {
    // 1. Validate course exists (Course service)
    const course = await this._getCourseOrThrow(courseId);

    // 2. Check permission
    if (!ChapterPermission.create(user, course)) {
      throw new Error('Unauthorized');
    }

    // 3. Create chapter (Chapter service - internal)
    return await chapterService.createChapterInternal(courseId, data);
  }

  /**
   * Update chapter with course ownership validation
   * Cross-module: Chapter + Course
   * @param {string} chapterId - Chapter ID
   * @param {Object} user - Authenticated user
   * @param {Object} data - Update data
   * @returns {{Promise<Object>}} Chapter DTO
   */
  async updateChapter(chapterId, user, data) {
    // 1. Get existing chapter (Chapter service)
    const chapter = await chapterService.getChapterByIdInternal(chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    // 2. Validate course ownership (Course service)
    const course = await this._getCourseOrThrow(chapter.courseId);

    // 3. Check permission
    if (!ChapterPermission.update(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Update chapter (Chapter service - internal)
    return await chapterService.updateChapterInternal(chapterId, data);
  }

  /**
   * Delete chapter with course ownership validation
   * Cross-module: Chapter + Course
   * @param {string} chapterId - Chapter ID
   * @param {Object} user - Authenticated user
   * @returns {boolean} Success
   */
  async deleteChapter(chapterId, user) {
    // 1. Get existing chapter (Chapter service)
    const chapter = await chapterService.getChapterByIdInternal(chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    // 2. Validate course ownership (Course service)
    const course = await this._getCourseOrThrow(chapter.courseId);

    // 3. Check permission
    if (!ChapterPermission.delete(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Delete chapter (Chapter service - internal)
    return await chapterService.deleteChapterInternal(chapterId);
  }

  // ====================================================================
  // LESSON OPERATIONS (Lesson + Chapter + Course)
  // ====================================================================

  /**
   * Create lesson with course and chapter validation
   * Cross-module: Lesson + Chapter + Course
   * @param {string} courseId - Course ID
   * @param {string} chapterId - Chapter ID
   * @param {Object} user - Authenticated user
   * @param {Object} data - Lesson data
   * @returns {{Promise<Object>}} Lesson DTO
   */
  async createLesson(courseId, chapterId, user, data) {
    // 1. Validate course exists (Course service)
    const course = await this._getCourseOrThrow(courseId);

    // 2. Validate chapter belongs to course (Chapter service)
    await this._getChapterOrThrow(chapterId, courseId);

    // 3. Check permission
    if (!LessonPermission.create(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Create lesson (Lesson service - internal)
    return await lessonService.createLessonInternal(courseId, chapterId, data);
  }

  /**
   * Update lesson with course ownership validation
   * Cross-module: Lesson + Course
   * @param {string} lessonId - Lesson ID
   * @param {Object} user - Authenticated user
   * @param {Object} data - Update data
   * @returns {Object} Lesson DTO
   */
  async updateLesson(lessonId, user, data) {
    // 1. Get existing lesson (Lesson service)
    const lesson = await lessonService.getLessonByIdInternal(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // 2. Validate course ownership (Course service)
    const course = await this._getCourseOrThrow(lesson.courseId);

    // 3. Check permission
    if (!LessonPermission.update(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Update lesson (Lesson service - internal)
    return await lessonService.updateLessonInternal(lessonId, data);
  }

  /**
   * Delete lesson with course ownership validation
   * Cross-module: Lesson + Course
   * @param {string} lessonId - Lesson ID
   * @param {Object} user - Authenticated user
   * @returns {boolean} Success
   */
  async deleteLesson(lessonId, user) {
    // 1. Get existing lesson (Lesson service)
    const lesson = await lessonService.getLessonByIdInternal(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // 2. Validate course ownership (Course service)
    const course = await this._getCourseOrThrow(lesson.courseId);

    // 3. Check permission
    if (!LessonPermission.delete(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Delete lesson (Lesson service - internal)
    return await lessonService.deleteLessonInternal(lessonId);
  }

  // ====================================================================
  // QUIZ OPERATIONS (Quiz + Lesson + Course)
  // ====================================================================

  /**
   * Create quiz with course and lesson validation
   * Cross-module: Quiz + Lesson + Course
   * @param {string} courseId - Course ID
   * @param {string|null} lessonId - Lesson ID (optional)
   * @param {Object} user - Authenticated user
   * @param {Object} data - Quiz data
   * @returns {Object} Quiz DTO
   */
  async createQuiz(courseId, lessonId, user, data) {
    // 1. Validate course exists (Course service)
    const course = await this._getCourseOrThrow(courseId);

    // 2. Validate lesson belongs to course if provided (Lesson service)
    if (lessonId) {
      await this._getLessonOrThrow(lessonId, courseId);
    }

    // 3. Check permission
    if (!QuizPermission.create(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Create quiz (Quiz service - internal)
    return await quizService.createQuizInternal(courseId, lessonId, data);
  }

  /**
   * Update quiz with course ownership validation
   * Cross-module: Quiz + Course
   * @param {string} quizId - Quiz ID
   * @param {Object} user - Authenticated user
   * @param {Object} data - Update data
   * @returns {Object} Quiz DTO
   */
  async updateQuiz(quizId, user, data) {
    // 1. Get existing quiz (Quiz service)
    const quiz = await quizService.getQuizByIdInternal(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // 2. Validate course ownership (Course service)
    const course = await this._getCourseOrThrow(quiz.courseId);

    // 3. Check permission
    if (!QuizPermission.update(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Update quiz (Quiz service - internal)
    return await quizService.updateQuizInternal(quizId, data);
  }

  /**
   * Delete quiz with course ownership validation
   * Cross-module: Quiz + Course
   * @param {string} quizId - Quiz ID
   * @param {Object} user - Authenticated user
   * @returns {boolean} Success
   */
  async deleteQuiz(quizId, user) {
    // 1. Get existing quiz (Quiz service)
    const quiz = await quizService.getQuizByIdInternal(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // 2. Validate course ownership (Course service)
    const course = await this._getCourseOrThrow(quiz.courseId);

    // 3. Check permission
    if (!QuizPermission.delete(user, course)) {
      throw new Error('Unauthorized');
    }

    // 4. Delete quiz (Quiz service - internal)
    return await quizService.deleteQuizInternal(quizId);
  }

  // ====================================================================
  // COURSE CONTENT AGGREGATION
  // ====================================================================

  /**
   * Get complete course content structure
   * Cross-module: Course + Chapter + Lesson + Quiz
   * @param {string} courseId - Course ID
   * @returns {Object} Course content DTO
   */
  async getCourseContent(courseId) {
    const cacheKey = `course_content_${courseId}`;
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Validate course exists
    const course = await this._getCourseOrThrow(courseId);

    // 2. Fetch all content in parallel using services
    const [chapters, lessons, quizzes] = await Promise.all([
      chapterService.getChaptersByCourseInternal(courseId),
      lessonService.getLessonsByCourseInternal(courseId),
      quizService.getQuizzesByCourseInternal(courseId),
    ]);

    // 3. Create lookup maps
    const lessonsByChapter = new Map();
    lessons.forEach(lesson => {
      if (!lessonsByChapter.has(lesson.chapterId)) {
        lessonsByChapter.set(lesson.chapterId, []);
      }
      lessonsByChapter.get(lesson.chapterId).push(lesson);
    });

    const quizzesByLesson = new Map();
    const courseQuizzes = [];
    quizzes.forEach(quiz => {
      if (quiz.lessonId) {
        if (!quizzesByLesson.has(quiz.lessonId)) {
          quizzesByLesson.set(quiz.lessonId, []);
        }
        quizzesByLesson.get(quiz.lessonId).push(quiz);
      } else {
        courseQuizzes.push(quiz);
      }
    });

    // 4. Build hierarchical structure
    const contentStructure = chapters
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(chapter => ({
        chapterId: chapter.chapterId,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        lessons: (lessonsByChapter.get(chapter.chapterId) || [])
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(lesson => ({
            lessonId: lesson.lessonId,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            duration: lesson.duration,
            type: lesson.type,
            quizzes: (quizzesByLesson.get(lesson.lessonId) || []).map(quiz => ({
              quizId: quiz.quizId,
              title: quiz.title,
              questionsCount: quiz.questions?.length || 0,
            })),
          })),
      }));

    // 5. Return clean DTO
    const result = {
      courseId: course.courseId,
      title: course.title,
      totalChapters: chapters.length,
      totalLessons: lessons.length,
      totalQuizzes: quizzes.length,
      chapters: contentStructure,
      courseQuizzes: courseQuizzes.map(quiz => ({
        quizId: quiz.quizId,
        title: quiz.title,
        questionsCount: quiz.questions?.length || 0,
      })),
    };

    // 6. Cache result
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    return result;
  }

  /**
   * Get course content stats for instructor dashboard
   * Cross-module: Course + Chapter + Lesson + Quiz
   * @param {string} courseId - Course ID
   * @returns {Object} Stats DTO
   */
  async getCourseContentStats(courseId) {
    const cacheKey = `course_content_stats_${courseId}`;
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Validate course exists
    const course = await this._getCourseOrThrow(courseId);

    // 2. Fetch counts using services
    const [chapters, lessons, quizzes] = await Promise.all([
      chapterService.getChaptersByCourseInternal(courseId),
      lessonService.getLessonsByCourseInternal(courseId),
      quizService.getQuizzesByCourseInternal(courseId),
    ]);

    // 3. Calculate total duration
    const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

    // 4. Calculate total questions
    const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

    // 5. Return clean DTO
    const result = {
      courseId: course.courseId,
      title: course.title,
      chaptersCount: chapters.length,
      lessonsCount: lessons.length,
      quizzesCount: quizzes.length,
      totalDurationMinutes: totalDuration,
      totalQuestions,
    };

    // 6. Cache result
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    return result;
  }
}

export const courseContentOrchestrator = new CourseContentOrchestrator();
