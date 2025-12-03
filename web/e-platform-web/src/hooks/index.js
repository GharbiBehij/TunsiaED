// Centralized exports for all User & Actor hooks
// This file provides a single import point for all actor-related React Query hooks
// Hooks are organized into DIRECT (single module) and ORCHESTRATED (cross-module) operations

// User Module Hooks
export {
  USER_KEYS,
  useUserProfile,
  useOnboardUser,
  useUpdateProfile,
  useDeleteProfile,
} from './User/useUser';

// Admin Actor Hooks
export {
  ADMIN_KEYS,
  useAdminStats,
  useAdminRevenue,
  useAdminActivity,
  useAdminCoursePerformance,
  useAdminUserEngagement,
  useAdminActivePromotions,
  useAdminSubscriptionPlans,
  useAdminSubscriptionStats,
  useAdminDashboard,
  useUpdateSubscriptionPlan,
  useCreatePromotion,
} from './Admin/useAdmin';

// Instructor Actor Hooks
// DIRECT: useInstructorStats, useInstructorCourses, useInstructorStudents, useInstructorRevenue,
//         useInstructorRevenueTrends, useInstructorActivity, useInstructorCoursePerformance, useInstructorStudentProgress
// ORCHESTRATED: useInstructorDashboard, useInstructorRevenueOverview, useInstructorCoursePerformanceDetailed
export {
  INSTRUCTOR_KEYS,
  // Direct hooks
  useInstructorStats,
  useInstructorCourses,
  useInstructorStudents,
  useInstructorRevenue,
  useInstructorRevenueTrends,
  useInstructorActivity,
  useInstructorCoursePerformance,
  useInstructorStudentProgress,
  // Orchestrated hooks
  useInstructorDashboard,
  useInstructorRevenueOverview,
  useInstructorCoursePerformanceDetailed,
} from './Instructor/useInstructor';

// Student Actor Hooks
// DIRECT: useStudentStats, useStudentCourses, useStudentEnrollments, useStudentProgress,
//         useStudentCertificates, useUpdateStudentProgress, useCompleteItem, useProgressById
// ORCHESTRATED: useStudentDashboard, useStudentEnrollmentsWithProgress, useStudentLearningOverview,
//               useStudentProgressOverview, useEnrollmentProgress, useCourseProgressSummary, useUpdateProgressOrchestrated
export {
  STUDENT_KEYS,
  // Direct hooks
  useStudentStats,
  useStudentCourses,
  useStudentEnrollments,
  useStudentProgress,
  useStudentCertificates,
  useUpdateStudentProgress,
  useCompleteItem,
  useProgressById,
  // Orchestrated hooks
  useStudentDashboard,
  useStudentEnrollmentsWithProgress,
  useStudentLearningOverview,
  useStudentProgressOverview,
  useEnrollmentProgress,
  useCourseProgressSummary,
  useUpdateProgressOrchestrated,
} from './Student/useStudent';

// Certificate Hooks
// DIRECT: useMyCertificates, useCertificateById, useCourseCertificates, useAllCertificates,
//         useIssueCertificate, useUpdateCertificate, useRevokeCertificate
// ORCHESTRATED: useCertificateEligibility, useGrantCertificate, useAutoGrantCertificates
export {
  CERTIFICATE_KEYS,
  // Direct hooks
  useMyCertificates,
  useCertificateById,
  useCourseCertificates,
  useAllCertificates,
  useIssueCertificate,
  useUpdateCertificate,
  useRevokeCertificate,
  // Orchestrated hooks
  useCertificateEligibility,
  useGrantCertificate,
  useAutoGrantCertificates,
} from './Certificate/useCertificate';

// Payment Hooks
// DIRECT: useMyPayments, usePaymentById, useCoursePayments, usePaymentsByStatus,
//         useCreatePayment, useUpdatePayment
// ORCHESTRATED: usePurchaseStatus, useInitiatePurchase, useCompletePurchase
export {
  PAYMENT_KEYS,
  // Direct hooks
  useMyPayments,
  usePaymentById,
  useCoursePayments,
  usePaymentsByStatus,
  useCreatePayment,
  useUpdatePayment,
  // Orchestrated hooks
  usePurchaseStatus,
  useInitiatePurchase,
  useCompletePurchase,
} from './Payment/usePayment';
