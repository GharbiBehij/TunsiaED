
// src/hooks/useCreateCourse.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CourseService from '../../services/CourseService';

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CourseService.createCourse,
    onSuccess: () => {
      // THIS IS THE MAGIC — INSTANT UPDATE FOR EVERYONE
      queryClient.invalidateQueries({ queryKey: ['Courses'] });
    },
  });
};