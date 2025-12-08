// src/hooks/Lesson/useLesson.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LessonService from '../../services/lessonService';
import { useAuth } from '../../context/AuthContext';
import { LESSON_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Fetch all lessons for a course (public)
 */
export const useLessonsByCourse = (courseId) => {
  return useQuery({
    queryKey: LESSON_KEYS.byCourse(courseId),
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
    queryKey: LESSON_KEYS.byChapter(chapterId),
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
    queryKey: LESSON_KEYS.detail(lessonId),
    queryFn: () => LessonService.getLessonById(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new lesson (instructor/admin only)
 */
export const useCreateLesson = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonData) => LessonService.createLesson(lessonData, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('createLesson');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Update a lesson (instructor/admin only)
 */
export const useUpdateLesson = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, lessonData }) => LessonService.updateLesson(lessonId, lessonData, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('updateLesson');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Delete a lesson (instructor/admin only)
 */
export const useDeleteLesson = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId) => LessonService.deleteLesson(lessonId, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('deleteLesson');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};
