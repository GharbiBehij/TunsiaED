import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { lessonController } from './Lesson.controller.js';

const router = Router();

// Public read endpoints
router.get('/', lessonController.getAllLessons);
router.get('/:lessonId', lessonController.getLessonById);
router.get('/chapter/:chapterId/list', lessonController.getLessonsByChapter);
router.get('/course/:courseId/list', lessonController.getLessonsByCourse);

// Authenticated write endpoints (instructor/admin checked in service)
router.post('/', authenticate, lessonController.createLesson);
router.put('/:lessonId', authenticate, lessonController.updateLesson);
router.delete('/:lessonId', authenticate, lessonController.deleteLesson);

export { router };


