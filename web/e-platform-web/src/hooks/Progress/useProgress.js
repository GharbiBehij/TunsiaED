// src/hooks/Progress/useProgress.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProgressService from '../../services/ProgressService';
import { useAuth } from '../../context/AuthContext';
import { PROGRESS_KEYS } from '../../core/query/queryKeys';

/**
 * Get or create progress for a module (mutation)
 * Creates new progress record if doesn't exist, returns existing if it does
 * @returns {UseMutationResult} Mutation for getting/creating progress
 */
export function useGetOrCreateProgress() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => ProgressService.getOrCreateProgress(token, data),
    onSuccess: (data, variables) => {
      // Invalidate related progress queries
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.user() });
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.enrollment(variables.enrollmentId) });
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.detail(data.id) });
    },
  });
}

/**
 * Get all progress for the authenticated user
 * @returns {UseQueryResult} User's progress data
 */
export function useGetMyProgress() {
  const { token } = useAuth();

  return useQuery({
    queryKey: PROGRESS_KEYS.user(),
    queryFn: () => ProgressService.getMyProgress(token),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get progress by ID
 * @param {string} progressId - The progress ID
 * @returns {UseQueryResult} Progress data
 */
export function useGetProgressById(progressId) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PROGRESS_KEYS.detail(progressId),
    queryFn: () => ProgressService.getProgressById(token, progressId),
    enabled: !!token && !!progressId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Update progress
 * @param {string} progressId - The progress ID to update
 * @returns {UseMutationResult} Mutation for updating progress
 */
export function useUpdateProgress(progressId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData) => ProgressService.updateProgress(token, progressId, updateData),
    onSuccess: () => {
      // Invalidate affected progress queries
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.detail(progressId) });
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.user() });
    },
  });
}

/**
 * Mark lesson/item as completed
 * @param {string} progressId - The progress ID
 * @returns {UseMutationResult} Mutation for marking item complete
 */
export function useMarkLessonComplete(progressId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => ProgressService.markItemCompleted(token, progressId, itemId),
    onSuccess: () => {
      // Invalidate affected progress queries
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.detail(progressId) });
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.user() });
    },
  });
}