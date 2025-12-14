// Repository for Quiz domain logic.
import { quizDao } from '../model/dao/Quiz.dao.js';

export class QuizRepository {
  // Create quiz via DAO
  async createQuiz(courseId, lessonId, data) {
    return await quizDao.createQuiz(courseId, lessonId, data);
  }

  // Find a quiz by ID via DAO
  async findByQuizId(quizId) {
    try {
      const doc = await quizDao.getQuizById(quizId);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Update quiz via DAO
  async updateQuiz(quizId, data) {
    try {
      const doc = await quizDao.updateQuiz(quizId, data);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Delete quiz via DAO
  async deleteQuiz(quizId) {
    try {
      await quizDao.deleteQuiz(quizId);
      return true;
    } catch {
      return false;
    }
  }

  // Find all quizzes by course via DAO
  async findQuizzesByCourse(courseId) {
    try {
      const docs = await quizDao.getQuizzesByCourse(courseId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all quizzes by lesson via DAO
  async findQuizzesByLesson(lessonId) {
    try {
      const docs = await quizDao.getQuizzesByLesson(lessonId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all quizzes via DAO
  async findAllQuizzes() {
    try {
      const docs = await quizDao.getAllQuizzes();
      return docs;
    } catch {
      return [];
    }
  }
}

export const quizRepository = new QuizRepository();


