// Centralized exports for all User & Actor hooks
// This file provides a single import point for all actor-related React Query hooks
// Hooks are organized into DIRECT (single module) and ORCHESTRATED (cross-module) operations

// User Module Hooks
export {
  useUserProfile,
  useOnboardUser,
  useUpdateProfile,
  useDeleteProfile,
} from './User/useUser';

// Auth Hooks
export {
  useLogin,
} from './Auth/useLogin';

export {
  useSignup,
} from './Auth/useSignup';

// Admin Actor Hooks
export {
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
//         useInstructorRevenueTrends, useInstructorActivity, useInstructorCoursePerformance, useInstructorStudentProgress, useInstructorStatus
// ORCHESTRATED: useInstructorDashboard, useInstructorRevenueOverview, useInstructorCoursePerformanceDetailed
export {
  // Direct hooks
  useInstructorStats,
  useInstructorCourses,
  useInstructorStudents,
  useInstructorRevenue,
  useInstructorRevenueTrends,
  useInstructorActivity,
  useInstructorCoursePerformance,
  useInstructorStudentProgress,
  useInstructorStatus,
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

// Chapter Hooks
export {
  useChaptersByCourse,
  useChapterById,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
} from './Chapter/useChapter';

// Course Hooks
export {
  useAllCourses,
  useCourseById,
  useCoursesByCategory,
  useSystemCourses,
  useCategories,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from './Course/useCourse';

// Enrollment Hooks
export {
  useMyEnrollments,
  useEnrollmentById,
  useEnrollInCourse,
} from './Enrollment/useEnrollment';

// Lesson Hooks
export {
  useLessonsByCourse,
  useLessonsByChapter,
  useLessonById,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from './Lesson/useLesson';

// Quiz Hooks
export {
  useAllQuizzes,
  useQuizById,
  useQuizzesByCourse,
  useQuizzesByLesson,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
} from './Quiz/useQuiz';

// Roles Hooks
export {
  useRoleRedirect,
} from './Roles/useRoleRedirect';

// Dashboard Guard Hook
export { useDashboardGuard } from './useDashboardGuard';

// Payment Hooks
// DIRECT: useMyPayments, usePaymentById, useCoursePayments, usePaymentsByStatus,
//         useCreatePayment, useUpdatePayment
// ORCHESTRATED: usePurchaseStatus, useInitiatePurchase, useCompletePurchase,
//               useInitiatePaymeePayment, usePaymeePaymentStatus, useSimulatePayment
export {
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
  useInitiatePaymeePayment,
  usePaymeePaymentStatus,
  useSimulatePayment,
} from './Payment/usePayment';

// Promo Code Hooks
export {
  useValidatePromoCode,
  useGetAllPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
} from './Promo/usePromoCode';

// Progress Hooks
export {
  useGetOrCreateProgress,
  useGetMyProgress,
  useGetProgressById,
  useUpdateProgress,
  useMarkLessonComplete,
} from './Progress/useProgress';

// Transaction Hooks
export {
  useCreateTransaction,
  useGetUserTransactions,
  useGetTransactionById,
  useGetTransactionsByPayment,
  useGetCourseTransactions,
  useGetTransactionsByStatus,
  useUpdateTransaction,
} from './Transaction/useTransaction';

// Cart Hooks
export {
  useGetCart,
  useAddToCart,
  useRemoveFromCart,
  useApplyPromo,
  useRemovePromo,
} from './Cart/useCart';

// Subscription Hooks
export {
  useSubscriptionPlans,
  useGetSubscriptionPlanById,
  useInitiateSubscription,
  useCancelSubscription,
} from './Subscription/useSubscription';
