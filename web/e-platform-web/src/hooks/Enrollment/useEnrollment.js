// src/hooks/Enrollment/useEnrollment.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EnrollmentService from '../../services/EnrollmentService';
import { useAuth } from '../../context/AuthContext';
import { ENROLLMENT_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Fetch user's enrollments
 */
export const useMyEnrollments = () => {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ENROLLMENT_KEYS.student(),
    queryFn: () => EnrollmentService.getUserEnrollments(token),
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60,
  });
};

/**
 * Fetch a specific enrollment by ID
 */
export const useEnrollmentById = (enrollmentId) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ENROLLMENT_KEYS.detail(enrollmentId),
    queryFn: () => EnrollmentService.getEnrollmentById(enrollmentId, token),
    enabled: !!enrollmentId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch enrollment progress
 */
export const useEnrollmentProgress = (enrollmentId) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: [...ENROLLMENT_KEYS.detail(enrollmentId), 'progress'],
    queryFn: () => EnrollmentService.getEnrollmentProgress(enrollmentId, token),
    enabled: !!enrollmentId && !!token,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Enroll in a course (mutation)
 */
export const useEnrollInCourse = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentData) => EnrollmentService.enroll(enrollmentData, token),
    onSuccess: () => {
      // Invalidate all affected queries based on mutation effect map
      const affectedKeys = getAffectedQueryKeys('enrollInCourse');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};
