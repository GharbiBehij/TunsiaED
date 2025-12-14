// Centralized Instructor Actor React Query hooks
// Organized into DIRECT (single module) and ORCHESTRATED (cross-module) hooks
import { useQuery } from '@tanstack/react-query';
import InstructorService from '../../services/InstructorService';
import { useAuth } from '../../context/AuthContext';
import { INSTRUCTOR_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Get instructor dashboard statistics
 * DIRECT: Calls /api/v1/instructor/stats
 * Stale after 2 minutes
 */
export function useInstructorStats() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.stats(),
    queryFn: () => InstructorService.getStats(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}
export function useInstructorStatus() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.status(),
    queryFn: () => InstructorService.getInstructorStatus(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}
/**
 * Get instructor's courses
 * DIRECT: Calls /api/v1/instructor/courses
 * Stale after 3 minutes
 */
export function useInstructorCourses() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.courses(),
    queryFn: () => InstructorService.getCourses(token),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!token,
  });
}

/**
 * Get instructor's enrolled students
 * DIRECT: Calls /api/v1/instructor/students
 * Stale after 5 minutes
 */
export function useInstructorStudents() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.students(),
    queryFn: () => InstructorService.getStudents(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get instructor's revenue data
 * DIRECT: Calls /api/v1/instructor/revenue
 * Stale after 5 minutes
 */
export function useInstructorRevenue() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.revenue(),
    queryFn: () => InstructorService.getRevenue(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get instructor's revenue trends over time
 * DIRECT: Calls /api/v1/instructor/revenue-trends
 * Stale after 5 minutes
 */
export function useInstructorRevenueTrends() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.revenueTrends(),
    queryFn: () => InstructorService.getRevenueTrends(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get instructor's recent activity
 * DIRECT: Calls /api/v1/instructor/activity
 * Stale after 1 minute
 */
export function useInstructorActivity() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.activity(),
    queryFn: () => InstructorService.getRecentActivity(token),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token,
  });
}

/**
 * Get instructor's course performance metrics (basic)
 * DIRECT: Calls /api/v1/instructor/courses/performance
 * Stale after 3 minutes
 */
export function useInstructorCoursePerformance() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.coursePerformance(),
    queryFn: () => InstructorService.getCoursePerformance(token),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!token,
  });
}

/**
 * Get student progress for a specific course (instructor view)
 * DIRECT: Calls /api/v1/instructor/courses/:courseId/students/progress
 * Stale after 1 minute (progress updates frequently)
 * @param {string} courseId - The course ID
 */
export function useInstructorStudentProgress(courseId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.studentProgress(courseId),
    queryFn: () => InstructorService.getStudentProgressForCourse(token, courseId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token && !!courseId,
  });
}

// ====================================================================
// ORCHESTRATED HOOKS (cross-module operations)
// These use backend orchestrators for aggregated data
// ====================================================================

/**
 * Get complete instructor dashboard data (aggregated)
 * ORCHESTRATOR: Uses InstructorDashboardOrchestrator
 * Aggregates stats, revenue trends, activity, and course performance
 * Cross-module: Instructor + Progress modules
 * Stale after 2 minutes
 */
export function useInstructorDashboard() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.dashboard(),
    queryFn: () => InstructorService.getDashboard(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Get instructor revenue overview (aggregated)
 * ORCHESTRATOR: Combines revenue data with trends
 * Stale after 5 minutes
 */
export function useInstructorRevenueOverview() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.revenueOverview(),
    queryFn: () => InstructorService.getRevenueOverview(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get course performance with detailed student progress
 * ORCHESTRATOR: Merges course performance with progress tracking
 * Cross-module: Instructor + Progress modules
 * Stale after 2 minutes
 * @param {string} [courseId] - Optional course ID for specific course
 */
export function useInstructorCoursePerformanceDetailed(courseId = null) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: INSTRUCTOR_KEYS.coursePerformanceDetailed(courseId),
    queryFn: () => InstructorService.getCoursePerformanceWithProgress(token, courseId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}
