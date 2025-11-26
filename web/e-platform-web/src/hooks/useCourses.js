// src/hooks/useCourses.js
import { useQuery } from '@tanstack/react-query';
import CourseService from '../services/CourseService';

export const useCourses = () => {
  return useQuery({
    queryKey: ['Courses'],
    queryFn: CourseService.getAllCourses,
    staleTime: 1000 * 60, // 1 minute
  });
};
//this hook is made for the user Course catalog 
// its made also for the admin dashboard to see all courses 