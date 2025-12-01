import { useQuery } from '@tanstack/react-query';
import InstructorService from '../services/InstructorService';
import { useAuth } from '../context/AuthContext';

export function useInstructorDashboard() {
  const { token } = useAuth();
  return useQuery(['dashboard-instructor'], async () => {
    const [
      stats,
      revenueTrends,
      recentActivity,
      coursePerformance,
    ] = await Promise.all([
      InstructorService.getStats(token),
      InstructorService.getRevenueTrends(token),
      InstructorService.getRecentActivity(token),
      InstructorService.getCoursePerformance(token),
    ]);
    return {
      stats,
      revenueTrends,
      recentActivity,
      coursePerformance,
    };
  });
}
