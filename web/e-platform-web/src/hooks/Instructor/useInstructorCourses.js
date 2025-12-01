import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import CourseService from '../../services/CourseService';

export const useInstructorCourses = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['instructorCourses'],
    queryFn: () => CourseService.getInstructorCourses(token),
    enabled: !!token,
    staleTime: 1000 * 60, // 1 minute
  });
};

