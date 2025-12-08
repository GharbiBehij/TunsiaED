// src/hooks/useChapters.js
// LEGACY FILE - Re-exports from organized hooks
// For backward compatibility with existing imports

export {
  useChaptersByCourse,
  useChapterById,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
} from './Chapter/useChapter';

export {
  useLessonsByCourse,
  useLessonsByChapter,
  useLessonById,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from './Lesson/useLesson';
