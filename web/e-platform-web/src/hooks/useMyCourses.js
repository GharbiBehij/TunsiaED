// src/hooks/useMyCourses.js
import { useQuery } from '@tanstack/react-query';
import CourseService from '../services/CourseService';
import { useAuth } from '../context/AuthContext';

export const useMyCourses = () => {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['my-courses'],
    queryFn: () => CourseService.getInstructorCourses(token),
    enabled: isAuthenticated && !!token, // ← only run when logged in
    staleTime: 1000 * 60, // 1 minute
  });
};
//this hook is responsible for seeing the courses by the instructor
// also made for the admin dashboard 