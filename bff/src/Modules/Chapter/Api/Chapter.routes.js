import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../middlewares/Role.middleware.js';
import { chapterController } from './Chapter.controller.js';

const router = Router();

// Public read endpoints
router.get('/', chapterController.getAllChapters);
router.get('/:chapterId', chapterController.getChapterById);
router.get('/course/:courseId/list', chapterController.getChaptersByCourse);

// Authenticated write endpoints
router.post('/', authenticate, requireRole('admin', 'instructor'), chapterController.createChapter);
router.put('/:chapterId', authenticate, requireRole('admin', 'instructor'), chapterController.updateChapter);
router.delete('/:chapterId', authenticate, requireRole('admin', 'instructor'), chapterController.deleteChapter);

export { router };


