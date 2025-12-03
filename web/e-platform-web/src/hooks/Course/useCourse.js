// src/hooks/Course/useCourse.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CourseService from '../../services/CourseService';
import { useAuth } from '../../context/AuthContext';
import { COURSE_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

// Re-export COURSE_KEYS for backward compatibility
export { COURSE_KEYS };

/**
 * Fetch all courses (public)
 */
export const useAllCourses = () => {
  return useQuery({
    queryKey: COURSE_KEYS.all(),
    queryFn: CourseService.getAllCourses,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Fetch a single course by ID (public)
 */
export const useCourseById = (courseId) => {
  return useQuery({
    queryKey: COURSE_KEYS.detail(courseId),
    queryFn: () => CourseService.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch courses by category (public)
 */
export const useCoursesByCategory = (category) => {
  return useQuery({
    queryKey: COURSE_KEYS.category(category),
    queryFn: () => CourseService.getCoursesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch instructor's courses (authenticated)
 */
export const useInstructorCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: COURSE_KEYS.instructor(),
    queryFn: async () => {
      const token = await user.getIdToken();
      return CourseService.getInstructorCourses(token);
    },
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Create a new course (authenticated instructor/admin)
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseData) => {
      const token = await user.getIdToken();
      return CourseService.createCourse(courseData, token);
    },
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('createCourse');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Update a course (authenticated instructor/admin)
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ courseId, courseData }) => {
      const token = await user.getIdToken();
      return CourseService.updateCourse(courseId, courseData, token);
    },
    onSuccess: (data, { courseId }) => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('updateCourse');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      // Dynamic key for specific course detail
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.detail(courseId) });
    },
  });
};

/**
 * Delete a course (authenticated instructor/admin)
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId) => {
      const token = await user.getIdToken();
      return CourseService.deleteCourse(courseId, token);
    },
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('deleteCourse');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};
