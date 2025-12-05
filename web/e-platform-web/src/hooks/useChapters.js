// src/hooks/useChapters.js
import { useQuery } from '@tanstack/react-query';
import ChapterService from '../services/chapterService';
import LessonService from '../services/lessonService';

/**
 * Fetch all chapters for a course (public)
 */
export const useChaptersByCourse = (courseId) => {
  return useQuery({
    queryKey: ['chapters', 'course', courseId],
    queryFn: () => ChapterService.getChaptersByCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Fetch a single chapter by ID (public)
 */
export const useChapterById = (chapterId) => {
  return useQuery({
    queryKey: ['chapters', chapterId],
    queryFn: () => ChapterService.getChapterById(chapterId),
    enabled: !!chapterId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch all lessons for a course (public)
 */
export const useLessonsByCourse = (courseId) => {
  return useQuery({
    queryKey: ['lessons', 'course', courseId],
    queryFn: () => LessonService.getLessonsByCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch all lessons for a chapter (public)
 */
export const useLessonsByChapter = (chapterId) => {
  return useQuery({
    queryKey: ['lessons', 'chapter', chapterId],
    queryFn: () => LessonService.getLessonsByChapter(chapterId),
    enabled: !!chapterId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch a single lesson by ID (public)
 */
export const useLessonById = (lessonId) => {
  return useQuery({
    queryKey: ['lessons', lessonId],
    queryFn: () => LessonService.getLessonById(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
};
