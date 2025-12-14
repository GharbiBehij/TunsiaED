// src/hooks/Promo/usePromoCode.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PromoCodeService from '../../services/PromoCodeService';
import { useAuth } from '../../context/AuthContext';
import { PROMO_CODE_KEYS } from '../../core/query/queryKeys';


/**
 * Validate promo code (public - no auth required)
 * @param {string} code - Promo code to validate
 * @param {number} subtotal - Cart subtotal
 * @param {string} courseId - Optional course ID
 * @returns {UseQueryResult} Validation result { valid, discount, discountType, discountValue }
 */
export function useValidatePromoCode(code, subtotal, courseId = null) {
  return useQuery({
    queryKey: PROMO_CODE_KEYS.validate(code, subtotal, courseId),
    queryFn: () => PromoCodeService.validatePromoCode(code, subtotal, courseId),
    enabled: !!code && !!subtotal,
    staleTime: 30 * 1000, // 30 seconds - promo validation can change
  });
}

/**
 * Get all promo codes (admin only)
 * @returns {UseQueryResult} List of all promo codes
 */
export function useGetAllPromoCodes() {
  const { token } = useAuth();

  return useQuery({
    queryKey: PROMO_CODE_KEYS.list(),
    queryFn: () => PromoCodeService.getAllPromoCodes(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Create promo code (admin only)
 * Invalidates promo codes list on success
 * @returns {UseMutationResult} Mutation for creating promo code
 */
export function useCreatePromoCode() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => PromoCodeService.createPromoCode(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.list() });
    },
  });
}

/**
 * Update promo code (admin only)
 * Invalidates promo codes list and specific promo code on success
 * @param {string} promoCodeId - ID of promo code to update
 * @returns {UseMutationResult} Mutation for updating promo code
 */
export function useUpdatePromoCode(promoCodeId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData) => PromoCodeService.updatePromoCode(token, promoCodeId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.detail(promoCodeId) });
    },
  });
}

/**
 * Delete promo code (admin only)
 * Invalidates promo codes list on success
 * @param {string} promoCodeId - ID of promo code to delete
 * @returns {UseMutationResult} Mutation for deleting promo code
 */
export function useDeletePromoCode(promoCodeId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PromoCodeService.deletePromoCode(token, promoCodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.detail(promoCodeId) });
    },
  });
}