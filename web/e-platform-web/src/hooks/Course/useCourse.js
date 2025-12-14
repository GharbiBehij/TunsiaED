// src/hooks/Course/useCourse.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CourseService from '../../services/CourseService';
import { useAuth } from '../../context/AuthContext';
import { COURSE_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Fetch all courses (public catalog)
 * Everyone can see all courses in the catalog
 * Access control happens at the course content level (enrollment or subscription required)
 */
export const useAllCourses = () => {
  return useQuery({
    queryKey: COURSE_KEYS.all(),
    queryFn: async () => {
      // Return ALL courses - system courses and instructor-created courses
      // Access control is enforced when trying to access course content
      return await CourseService.getAllCourses();
    },
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
 * Fetch system courses (public)
 */
export const useSystemCourses = () => {
  return useQuery({
    queryKey: COURSE_KEYS.system(),
    queryFn: CourseService.getSystemCourses,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes (system courses change rarely)
  });
};

/**
 * Fetch all categories (public)
 */
export const useCategories = () => {
  return useQuery({
    queryKey: COURSE_KEYS.categories(),
    queryFn: CourseService.getAllCategories,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

/**
 * Fetch instructor's courses (authenticated)
 */
export const useInstructorCourses = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: COURSE_KEYS.instructor(),
    queryFn: async () => {
      return CourseService.getInstructorCourses(token);
    },
    enabled: !!token,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Create a new course (authenticated instructor/admin)
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (courseData) => {
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
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({ courseId, courseData }) => {
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
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (courseId) => {
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
