// Centralized Certificate React Query hooks
// Organized into DIRECT (single module) and ORCHESTRATED (cross-module) hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CertificateService from '../../services/CertificateService';
import { useAuth } from '../../context/AuthContext';
import { CERTIFICATE_KEYS, STUDENT_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

// ====================================================================
// DIRECT HOOKS (single module operations)
// These call individual service endpoints without orchestration
// ====================================================================

/**
 * Get current user's certificates
 * DIRECT: Calls /api/v1/certificate/me
 * Stale after 5 minutes (certificates rarely change)
 */
export function useMyCertificates() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: CERTIFICATE_KEYS.mine(),
    queryFn: () => CertificateService.getMyCertificates(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
}

/**
 * Get certificate by ID (public)
 * DIRECT: Calls /api/v1/certificate/:certificateId
 * @param {string} certificateId - The certificate ID
 */
export function useCertificateById(certificateId) {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.byId(certificateId),
    queryFn: () => CertificateService.getCertificateById(certificateId),
    staleTime: 10 * 60 * 1000, // 10 minutes (certificates don't change)
    enabled: !!certificateId,
  });
}

/**
 * Get certificates for a course (public)
 * DIRECT: Calls /api/v1/certificate/course/:courseId
 * @param {string} courseId - The course ID
 */
export function useCourseCertificates(courseId) {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.byCourse(courseId),
    queryFn: () => CertificateService.getCourseCertificates(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!courseId,
  });
}

/**
 * Get all certificates (admin)
 * DIRECT: Calls /api/v1/certificate
 */
export function useAllCertificates() {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.allCertificates(),
    queryFn: () => CertificateService.getAllCertificates(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Issue a certificate directly
 * DIRECT: Calls POST /api/v1/certificate
 */
export function useIssueCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => CertificateService.issueCertificate(token, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.mine() });
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.byCourse(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.allCertificates() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.certificates() });
    },
  });
}

/**
 * Update a certificate (admin only)
 * DIRECT: Calls PUT /api/v1/certificate/:certificateId
 */
export function useUpdateCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ certificateId, data }) => 
      CertificateService.updateCertificate(token, certificateId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.byId(variables.certificateId) });
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.allCertificates() });
    },
  });
}

/**
 * Revoke a certificate (admin only)
 * DIRECT: Calls DELETE /api/v1/certificate/:certificateId
 */
export function useRevokeCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (certificateId) => CertificateService.revokeCertificate(token, certificateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.certificates() });
    },
  });
}

// ====================================================================
// ORCHESTRATED HOOKS (cross-module operations)
// These use backend orchestrators for validation + operations
// ====================================================================

/**
 * Check certificate eligibility
 * ORCHESTRATOR: Uses CertificateGrantingOrchestrator
 * Validates course completion status
 * Cross-module: Certificate + Progress + Enrollment modules
 * @param {string} courseId - The course ID
 */
export function useCertificateEligibility(courseId) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: CERTIFICATE_KEYS.eligibility(courseId),
    queryFn: () => CertificateService.checkEligibility(token, courseId),
    staleTime: 30 * 1000, // 30 seconds (eligibility can change quickly)
    enabled: !!token && !!courseId,
  });
}

/**
 * Grant certificate with completion validation
 * ORCHESTRATOR: Uses CertificateGrantingOrchestrator
 * Validates course completion then issues certificate
 * Cross-module: Certificate + Progress + Enrollment + Course modules
 */
export function useGrantCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => CertificateService.grantCertificate(token, data),
    onSuccess: (_, variables) => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('grantCertificate');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      // Dynamic keys based on variables
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.eligibility(variables.courseId) });
        queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.byCourse(variables.courseId) });
      }
    },
  });
}

/**
 * Auto-grant certificates for completed courses (admin only)
 * ORCHESTRATOR: Uses CertificateGrantingOrchestrator
 * Batch process to grant certificates to all eligible students
 * Cross-module: Certificate + Progress + Enrollment + User modules
 */
export function useAutoGrantCertificates() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (options) => CertificateService.autoGrantCertificates(token, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.certificates() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.learningOverview() });
    },
  });
}
