// src/hooks/Cart/useCart.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartService } from '../../services/CartService';
import { PaymentService } from '../../services/PaymentService';
import { useAuth } from '../../context/AuthContext';
import { CART_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Get current user's cart
 * @returns {UseQueryResult} User's cart data
 */
export function useGetCart() {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CART_KEYS.current(),
    queryFn: () => CartService.getCart(token),
    enabled: isAuthenticated && !!token,
    staleTime: 1 * 60 * 1000, // 1 minute - cart changes frequently
  });
}

/**
 * Add item to cart
 * @returns {UseMutationResult} Mutation for adding item to cart
 */
export function useAddToCart() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => CartService.addItem(token, payload),
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('addToCart');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

/**
 * Remove item from cart
 * @returns {UseMutationResult} Mutation for removing item from cart
 */
export function useRemoveFromCart() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => CartService.removeItem(token, itemId),
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('removeFromCart');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

/**
 * Apply promo code to cart
 * @returns {UseMutationResult} Mutation for applying promo code
 */
export function useApplyPromo() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code) => CartService.applyPromo(token, code),
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('applyPromo');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

/**
 * Remove promo code from cart
 * @returns {UseMutationResult} Mutation for removing promo code
 */
export function useRemovePromo() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartService.removePromo(token),
    onSuccess: () => {
      // Use centralized mutation effect map
      const affectedKeys = getAffectedQueryKeys('removePromo');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
export function useCartCheckout() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: () => CartService.checkout(token),
  });

  const paymeeMutation = useMutation({
    mutationFn: (paymentId) =>
      PaymentService.initiatePaymeePayment({ paymentId }, token),
  });

  const checkout = async () => {
    const checkoutResult = await checkoutMutation.mutateAsync();
    const paymentId = checkoutResult.paymentId;

    if (!paymentId) {
      throw new Error('Payment ID missing from cart checkout response');
    }

    const paymeeResult = await paymeeMutation.mutateAsync(paymentId);

    if (!paymeeResult.checkoutUrl) {
      throw new Error('Checkout URL missing from Paymee response');
    }

    // Invalidate queries after successful checkout
    const affectedKeys = getAffectedQueryKeys('checkoutCart');
    affectedKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });

    return paymeeResult.checkoutUrl;
  };

  return {
    checkout,
    isLoading: checkoutMutation.isPending || paymeeMutation.isPending,
  };
}