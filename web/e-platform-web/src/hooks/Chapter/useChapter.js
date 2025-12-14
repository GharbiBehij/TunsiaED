// Centralized Chapter React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChapterService from '../../services/chapterService';
import { useAuth } from '../../context/AuthContext';
import { CHAPTER_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Fetch all chapters for a course (public)
 */
export const useChaptersByCourse = (courseId) => {
  return useQuery({
    queryKey: CHAPTER_KEYS.byCourse(courseId),
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
    queryKey: CHAPTER_KEYS.detail(chapterId),
    queryFn: () => ChapterService.getChapterById(chapterId),
    enabled: !!chapterId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new chapter (instructor/admin only)
 */
export const useCreateChapter = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterData) => ChapterService.createChapter(chapterData, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('createChapter');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Update a chapter (instructor/admin only)
 */
export const useUpdateChapter = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, chapterData }) => ChapterService.updateChapter(chapterId, chapterData, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('updateChapter');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Delete a chapter (instructor/admin only)
 */
export const useDeleteChapter = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId) => ChapterService.deleteChapter(chapterId, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('deleteChapter');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};
