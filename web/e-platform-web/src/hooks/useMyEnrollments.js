// src/hooks/useMyEnrollments.js
import { useQuery } from '@tanstack/react-query';
import EnrollmentService from '../services/EnrollmentService';
import { useAuth } from '../context/AuthContext';

export const useMyEnrollments = () => {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['Enrollments'],
    queryFn: () => EnrollmentService.getUserEnrollments(token),
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60,
  });
};