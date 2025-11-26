import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { chapterController } from './Chapter.controller.js';

const router = Router();

// Public read endpoints
router.get('/', chapterController.getAllChapters);
router.get('/:chapterId', chapterController.getChapterById);
router.get('/course/:courseId/list', chapterController.getChaptersByCourse);

// Authenticated write endpoints (instructor/admin checked in service)
router.post('/', authenticate, chapterController.createChapter);
router.put('/:chapterId', authenticate, chapterController.updateChapter);
router.delete('/:chapterId', authenticate, chapterController.deleteChapter);

export { router };


