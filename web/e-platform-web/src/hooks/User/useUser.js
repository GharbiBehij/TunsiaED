// Centralized User React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import { USER_KEYS, STUDENT_KEYS, INSTRUCTOR_KEYS, ADMIN_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Get authenticated user's profile
 * Caches for 5 minutes
 */
export function useUserProfile() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: () => UserService.getMyProfile(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!token,
  });
}

/**
 * Create new user profile (onboarding)
 * Invalidates profile cache on success
 */
export function useOnboardUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => UserService.onboardUser(token, data),
    onSuccess: () => {
      // Invalidate user profile and all dashboard views
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() });
    },
  });
}

/**
 * Update user profile
 * Invalidates profile cache on success
 */
export function useUpdateProfile() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => UserService.updateProfile(token, data),
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('updateProfile');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

/**
 * Delete user profile
 * Clears all queries on success (user logged out)
 */
export function useDeleteProfile() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => UserService.deleteProfile(token),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data
    },
  });
}
