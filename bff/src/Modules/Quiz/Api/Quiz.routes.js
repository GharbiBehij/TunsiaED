import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { quizController } from './Quiz.controller.js';

const router = Router();

// Public read endpoints
router.get('/', quizController.getAllQuizzes);
router.get('/:quizId', quizController.getQuizById);
router.get('/course/:courseId/list', quizController.getQuizzesByCourse);
router.get('/lesson/:lessonId/list', quizController.getQuizzesByLesson);

// Authenticated write endpoints
router.post('/', authenticate, quizController.createQuiz);
router.put('/:quizId', authenticate, quizController.updateQuiz);
router.delete('/:quizId', authenticate, quizController.deleteQuiz);

export { router };


