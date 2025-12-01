import { useQuery } from '@tanstack/react-query';
import StudentService from '../services/StudentService';
import { useAuth } from '../context/AuthContext';

export function useStudentDashboard() {
  const { token } = useAuth();
    return useQuery(['dashboard-student'], async () => {
    const [stats, courses] = await Promise.all([
      StudentService.getStats(token),
      StudentService.getCourses(token),
    ]);
    return { stats, courses };
  });
}
