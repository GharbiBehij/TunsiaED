import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PaymentService from '../../services/PaymentService';
import AdminService from '../../services/AdminService';
import { useAuth } from '../../context/AuthContext';
import { PAYMENT_KEYS, STUDENT_KEYS, ADMIN_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

// ====================================================================
// DIRECT HOOKS (single module operations)
// These call individual service endpoints without orchestration
// ====================================================================

/**
 * Get current user's payments
 * DIRECT: Calls /api/v1/payment/my-payments
 * Stale after 2 minutes
 */
export function useMyPayments() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: PAYMENT_KEYS.mine(),
    queryFn: () => PaymentService.getUserPayments(token),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!token,
  });
}

/**
 * Get payment by ID
 * DIRECT: Calls /api/v1/payment/:paymentId
 * @param {string} paymentId - The payment ID
 */
export function usePaymentById(paymentId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: PAYMENT_KEYS.byId(paymentId),
    queryFn: async () => {
      const raw = await PaymentService.getPaymentById(paymentId, token);
      // Normalize: ensure paymentId field exists
      const normalized = {
        ...raw,
        paymentId: raw.paymentId || raw.id || raw._id,
      };
      console.log('💳 [usePaymentById] Payment data normalized:', normalized);
      return normalized;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!token && !!paymentId,
  });
}
/**
 * Reject course mutation
 * Invalidates course-related queries on success
 */
export function useRejectCourse() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reason }) =>
      AdminService.rejectCourse(token, courseId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.courses() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.activity() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.coursePerformance() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() });
    },
  });
}

/**
 * Get payments for a course
 * DIRECT: Calls /api/v1/payment/course/:courseId
 * @param {string} courseId - The course ID
 */
export function useCoursePayments(courseId) {
  return useQuery({
    queryKey: PAYMENT_KEYS.byCourse(courseId),
    queryFn: () => PaymentService.getCoursePayments(courseId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!courseId,
  });
}

/**
 * Get payments by status
 * DIRECT: Calls /api/v1/payment/status/:status
 * @param {string} status - The payment status
 */
export function usePaymentsByStatus(status) {
  return useQuery({
    queryKey: PAYMENT_KEYS.byStatus(status),
    queryFn: () => PaymentService.getPaymentsByStatus(status),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!status,
  });
}

/**
 * Create a payment directly
 * DIRECT: Calls POST /api/v1/payment
 */
export function useCreatePayment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData) => PaymentService.createPayment(paymentData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.mine() });
    },
  });
}

/**
 * Update a payment
 * DIRECT: Calls PUT /api/v1/payment/:paymentId
 */
export function useUpdatePayment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, paymentData }) => 
      PaymentService.updatePayment(paymentId, paymentData, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.byId(variables.paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.mine() });
    },
  });
}

// ====================================================================
// ORCHESTRATED HOOKS (cross-module operations)
// These use CoursePurchaseOrchestrator for course purchase flow
// ====================================================================

/**
 * Get purchase status (aggregated)
 * ORCHESTRATOR: Uses CoursePurchaseOrchestrator
 * Returns payment + transaction + enrollment status
 * Cross-module: Payment + Transaction + Enrollment modules
 * @param {string} paymentId - The payment ID
 */
export function usePurchaseStatus(paymentId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: PAYMENT_KEYS.purchaseStatus(paymentId),
    queryFn: () => PaymentService.getPurchaseStatus(paymentId, token),
    staleTime: 30 * 1000, // 30 seconds (status can change)
    enabled: !!token && !!paymentId,
  });
}

/**
 * Initiate a course purchase
 * ORCHESTRATOR: Uses CoursePurchaseOrchestrator
 * Validates course, checks enrollment, creates payment
 * Cross-module: Payment + Enrollment + Course modules
 */
export function useInitiatePurchase() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (purchaseData) => PaymentService.initiatePurchase(purchaseData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.mine() });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.purchaseStatus() });
    },
  });
}

/**
 * Complete a course purchase
 * ORCHESTRATOR: Uses CoursePurchaseOrchestrator
 * Creates transaction, updates payment, creates enrollment
 * Cross-module: Payment + Transaction + Enrollment modules
 */
export function useCompletePurchase() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (confirmationData) => PaymentService.completePurchase(confirmationData, token),
    onSuccess: (_, variables) => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('confirmPayment');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      // Dynamic keys based on variables
      if (variables.paymentId) {
        queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.byId(variables.paymentId) });
        queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.purchaseStatus(variables.paymentId) });
      }
    },
  });
}

// ====================================================================
// STRIPE GATEWAY HOOKS (International payment gateway)
// Integration without redirection - uses Stripe Checkout
// ====================================================================

/**
 * Initiate a Stripe/Paymee payment
 * Creates payment and returns Checkout URL
 * @returns {UseMutationResult} Mutation with { paymentId, sessionId, checkoutUrl, amount }
 */
export function useInitiatePaymeePayment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData) => PaymentService.initiatePaymeePayment(paymentData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.mine() });
    },
  });
}

// Alias for backward compatibility (Stripe → Paymee migration)
export const useInitiateStripePayment = useInitiatePaymeePayment;
/**
 * Get Stripe payment status by session ID
 * Used after Stripe Checkout completion to check status
 * @param {string} sessionId - The Stripe session ID
 * @param {Object} options - Query options (enabled, refetchInterval, etc.)
 */
export function usePaymeePaymentStatus(sessionId, options = {}) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: PAYMENT_KEYS.paymeeStatus(sessionId),
    queryFn: () => PaymentService.getPaymeePaymentStatus(sessionId, token),
    staleTime: 5 * 1000, // 5 seconds (status can change quickly)
    enabled: !!token && !!sessionId,
    ...options,
  });
}
// ====================================================================
// SIMULATION HOOKS (for testing when payment gateway is unavailable)
// ====================================================================

/**
 * Get Stripe/Payment gateway session status
 * Used for polling payment gateway status during processing
 * @param {string} sessionId - The gateway session ID
 * @param {object} options - Query options
 */
export function useStripePaymentStatus(sessionId, options = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PAYMENT_KEYS.paymeeStatus(sessionId),
    queryFn: () => PaymentService.getPaymeePaymentStatus(sessionId, token),
    enabled: !!token && !!sessionId && (options.enabled !== false),
    refetchInterval: options.refetchInterval || false,
    staleTime: 10 * 1000, // 10 seconds for status polling
    ...options,
  });
}

/**
 * Simulate a payment (for testing purposes)
 * Creates payment, completes it, and sends email notification
 * @returns {UseMutationResult} Mutation with { success, message, paymentId, transactionId?, enrollment? }
 */
export function useSimulatePayment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => PaymentService.simulatePayment(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.mine() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.enrollments() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.courses() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.learningOverview() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.enrollmentsDetailed() });
      queryClient.invalidateQueries({ queryKey: ['Enrollments'] });
    },
  });
}
