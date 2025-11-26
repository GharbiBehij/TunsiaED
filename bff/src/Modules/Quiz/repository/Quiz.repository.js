// Repository for Quiz domain logic.
import { quizDao } from '../model/dao/Quiz.dao.js';
import { Quiz } from '../model/entity/Quiz.entity.js';

export class QuizRepository {
  async createQuiz(courseId, lessonId, data) {
    const raw = await quizDao.createQuiz(courseId, lessonId, data);
    return new Quiz(
      raw.quizId,
      raw.courseId,
      raw.lessonId,
      raw.title,
      raw.totalQuestions,
      raw.passingScore,
      raw.isPublished,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
      raw
    );
  }

  async findByQuizId(quizId) {
    try {
      const doc = await quizDao.getQuizById(quizId);
      if (!doc) return null;
      return new Quiz(
        quizId,
        doc.courseId,
        doc.lessonId,
        doc.title,
        doc.totalQuestions,
        doc.passingScore,
        doc.isPublished,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async updateQuiz(quizId, data) {
    try {
      const doc = await quizDao.updateQuiz(quizId, data);
      if (!doc) return null;
      return new Quiz(
        quizId,
        doc.courseId,
        doc.lessonId,
        doc.title,
        doc.totalQuestions,
        doc.passingScore,
        doc.isPublished,
        new Date(doc.createdAt),
        new Date(doc.updatedAt),
        doc
      );
    } catch {
      return null;
    }
  }

  async deleteQuiz(quizId) {
    try {
      await quizDao.deleteQuiz(quizId);
      return true;
    } catch {
      return false;
    }
  }

  async findQuizzesByCourse(courseId) {
    try {
      const docs = await quizDao.getQuizzesByCourse(courseId);
      return docs.map(doc =>
        new Quiz(
          doc.quizId,
          doc.courseId,
          doc.lessonId,
          doc.title,
          doc.totalQuestions,
          doc.passingScore,
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

  async findQuizzesByLesson(lessonId) {
    try {
      const docs = await quizDao.getQuizzesByLesson(lessonId);
      return docs.map(doc =>
        new Quiz(
          doc.quizId,
          doc.courseId,
          doc.lessonId,
          doc.title,
          doc.totalQuestions,
          doc.passingScore,
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

  async findAllQuizzes() {
    try {
      const docs = await quizDao.getAllQuizzes();
      return docs.map(doc =>
        new Quiz(
          doc.quizId,
          doc.courseId,
          doc.lessonId,
          doc.title,
          doc.totalQuestions,
          doc.passingScore,
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

export const quizRepository = new QuizRepository();


