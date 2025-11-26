// Service layer for quiz-related logic.
import { quizRepository } from '../repository/Quiz.repository.js';
import { courseRepository } from '../../Course/repository/Course.repository.js';
import { lessonRepository } from '../../Lesson/repository/Lesson.repository.js';
import { canCreateQuiz, canUpdateQuiz, canDeleteQuiz } from './QuizPermission.js';

export class QuizService {
  async createQuiz(courseId, lessonId, user, data) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) throw new Error('Course not found');

    if (lessonId) {
      const lesson = await lessonRepository.findByLessonId(lessonId);
      if (!lesson || lesson.courseId !== courseId) {
        throw new Error('Lesson not found');
      }
    }

    if (!canCreateQuiz(user, course)) {
      throw new Error('Unauthorized');
    }

    return quizRepository.createQuiz(courseId, lessonId, data);
  }

  async getQuizById(quizId) {
    return quizRepository.findByQuizId(quizId);
  }

  async getQuizzesByCourse(courseId) {
    return quizRepository.findQuizzesByCourse(courseId);
  }

  async getQuizzesByLesson(lessonId) {
    return quizRepository.findQuizzesByLesson(lessonId);
  }

  async getAllQuizzes() {
    return quizRepository.findAllQuizzes();
  }

  async updateQuiz(quizId, user, data) {
    const existing = await quizRepository.findByQuizId(quizId);
    if (!existing) throw new Error('Quiz not found');

    const course = await courseRepository.findByCourseId(existing.courseId);
    if (!course) throw new Error('Course not found');

    if (!canUpdateQuiz(user, course)) {
      throw new Error('Unauthorized');
    }

    return quizRepository.updateQuiz(quizId, data);
  }

  async deleteQuiz(quizId, user) {
    const existing = await quizRepository.findByQuizId(quizId);
    if (!existing) throw new Error('Quiz not found');

    const course = await courseRepository.findByCourseId(existing.courseId);
    if (!course) throw new Error('Course not found');

    if (!canDeleteQuiz(user, course)) {
      throw new Error('Unauthorized');
    }

    return quizRepository.deleteQuiz(quizId);
  }
}

export const quizService = new QuizService();


