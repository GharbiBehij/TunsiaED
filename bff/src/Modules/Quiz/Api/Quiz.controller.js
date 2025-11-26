// Controllers for Quiz HTTP endpoints.
import { quizService } from '../service/Quiz.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

export const createQuiz = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isAdmin = user?.isAdmin === true;

    const quiz = await quizService.createQuiz(
      courseId,
      lessonId ?? null,
      user,
      req.body
    );

    res.status(201).json(quiz);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Course not found' || err.message === 'Lesson not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await quizService.getQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await quizService.getQuizzesByCourse(courseId);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuizzesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const quizzes = await quizService.getQuizzesByLesson(lessonId);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isAdmin = user?.isAdmin === true;

    const updated = await quizService.updateQuiz(
      quizId,
      user,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ error: 'Update failed' });
    }

    res.json(updated);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Quiz not found' || err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isAdmin = user?.isAdmin === true;

    await quizService.deleteQuiz(quizId, user);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Quiz not found' || err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const quizController = {
  createQuiz,
  getQuizById,
  getQuizzesByCourse,
  getQuizzesByLesson,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
};


