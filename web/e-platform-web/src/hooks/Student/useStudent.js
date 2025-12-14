// Centralized Student Actor React Query hooks
// Organized into DIRECT (single module) and ORCHESTRATED (cross-module) hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StudentService from '../../services/StudentService';
import ProgressService from '../../services/ProgressService';
import { useAuth } from '../../context/AuthContext';
import { STUDENT_KEYS, INSTRUCTOR_KEYS, ADMIN_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

// ====================================================================
// DIRECT HOOKS (single module operations)
// These call individual service endpoints without orchestration
// ====================================================================

/**
 * Get student dashboard statistics
 * DIRECT: Calls /api/v1/student/stats
 * Stale after 2 minutes
 */
export function useStudentStats() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.stats(),
    queryFn: () => StudentService.getStats(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Get student's enrolled courses
 * DIRECT: Calls /api/v1/student/courses
 * Stale after 3 minutes
 */
export function useStudentCourses() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.courses(),
    queryFn: () => StudentService.getCourses(token),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!token,
  });
}

/**
 * Get student's course enrollments (basic)
 * DIRECT: Calls /api/v1/student/enrollments
 * Stale after 3 minutes
 */
export function useStudentEnrollments() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.enrollments(),
    queryFn: () => StudentService.getEnrollments(token),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!token,
  });
}

/**
 * Get student's learning progress (basic, via Progress module)
 * DIRECT: Calls /api/v1/progress/my-progress
 * Stale after 1 minute (progress updates frequently)
 */
export function useStudentProgress() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.progress(),
    queryFn: () => ProgressService.getMyProgress(token),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token,
  });
}

/**
 * Get student's earned certificates
 * DIRECT: Calls /api/v1/student/certificates
 * Stale after 5 minutes (certificates rarely change)
 */
export function useStudentCertificates() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.certificates(),
    queryFn: () => StudentService.getCertificates(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Update progress by progressId (via Progress module)
 * DIRECT: Calls /api/v1/progress/:progressId
 * Invalidates progress and enrollment queries on success
 */
export function useUpdateStudentProgress() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ progressId, updateData }) => 
      ProgressService.updateProgress(token, progressId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.progress() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.enrollments() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.enrollmentsDetailed() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.progressOverview() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.learningOverview() });
      // Instructor dashboards depend on student progress
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.coursePerformance() });
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.coursePerformanceDetailed() });
      // Admin dashboards depend on course performance and user engagement
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.coursePerformance() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.userEngagement() });
    },
  });
}

/**
 * Mark an item as completed (via Progress module)
 * DIRECT: Calls /api/v1/progress/:progressId/complete-item
 * Invalidates progress, enrollment, and certificate queries on success
 */
export function useCompleteItem() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ progressId, itemId }) => 
      ProgressService.markItemCompleted(token, progressId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.progress() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.enrollments() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.certificates() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.enrollmentsDetailed() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.progressOverview() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.learningOverview() });
      // Instructor dashboards depend on student progress and completion
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.coursePerformance() });
      queryClient.invalidateQueries({ queryKey: INSTRUCTOR_KEYS.coursePerformanceDetailed() });
      // Admin dashboards depend on completion stats and activity
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.coursePerformance() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.userEngagement() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
    },
  });
}

/**
 * Get progress by ID (via Progress module)
 * DIRECT: Calls /api/v1/progress/:progressId
 * @param {string} progressId - The progress ID
 */
export function useProgressById(progressId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.progressDetail(progressId),
    queryFn: () => ProgressService.getProgressById(token, progressId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!token && !!progressId,
  });
}

// ====================================================================
// ORCHESTRATED HOOKS (cross-module operations)
// These use backend orchestrators for aggregated data
// ====================================================================

/**
 * Get complete student dashboard data (aggregated)
 * ORCHESTRATOR: Uses StudentDashboardOrchestrator
 * Aggregates stats, courses, enrollments, certificates, progress
 * Cross-module: Student + Progress + Enrollment + Certificate modules
 * Stale after 2 minutes
 */
export function useStudentDashboard() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.dashboard(),
    queryFn: () => StudentService.getDashboard(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Get enrollments with detailed progress data
 * ORCHESTRATOR: Merges enrollment and progress data
 * Cross-module: Student + Progress modules
 * Stale after 1 minute
 */
export function useStudentEnrollmentsWithProgress() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.enrollmentsDetailed(),
    queryFn: () => StudentService.getEnrollmentsWithProgress(token),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token,
  });
}

/**
 * Get comprehensive learning overview
 * ORCHESTRATOR: Combines stats, progress, certificates for complete view
 * Cross-module: Student + Progress + Certificate modules
 * Stale after 2 minutes
 */
export function useStudentLearningOverview() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.learningOverview(),
    queryFn: () => StudentService.getLearningOverview(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Get overall progress overview
 * ORCHESTRATOR: Gets all courses progress summary
 * Cross-module: Student + Progress modules
 * Stale after 1 minute
 */
export function useStudentProgressOverview() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.progressOverview(),
    queryFn: () => StudentService.getProgressOverview(token),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token,
  });
}

/**
 * Get detailed enrollment progress for a specific enrollment
 * ORCHESTRATOR: Gets detailed progress for specific enrollment
 * Cross-module: Student + Progress modules
 * Stale after 30 seconds (active learning progress)
 * @param {string} enrollmentId - The enrollment ID
 */
export function useEnrollmentProgress(enrollmentId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.progressByEnrollment(enrollmentId),
    queryFn: () => StudentService.getProgressByEnrollment(token, enrollmentId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!token && !!enrollmentId,
  });
}

/**
 * Get course progress summary
 * ORCHESTRATOR: Gets course-specific progress summary
 * Cross-module: Student + Progress modules
 * @param {string} courseId - The course ID
 */
export function useCourseProgressSummary(courseId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: STUDENT_KEYS.progressByCourse(courseId),
    queryFn: () => StudentService.getProgressByCourse(token, courseId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token && !!courseId,
  });
}

/**
 * Update progress with enrollment synchronization
 * ORCHESTRATOR: Updates progress and keeps enrollment in sync
 * Cross-module: Student + Progress + Enrollment modules
 */
export function useUpdateProgressOrchestrated() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (progressData) => 
      StudentService.updateProgressOrchestrated(token, progressData),
    onSuccess: (_, variables) => {
      // Use centralized mutation effect map for invalidation
      const affectedKeys = getAffectedQueryKeys('updateProgressOrchestrated');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      // Dynamic keys based on variables
      if (variables.enrollmentId) {
        queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.progressByEnrollment(variables.enrollmentId) });
      }
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.progressByCourse(variables.courseId) });
      }
    },
  });
}
