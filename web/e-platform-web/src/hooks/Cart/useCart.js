// src/hooks/Cart/useCart.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartService } from '../../services/CartService';
import { useAuth } from '../../context/AuthContext';
import { CART_KEYS } from '../../core/query/queryKeys';

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
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: CART_KEYS.current() });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.summary() });
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
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: CART_KEYS.current() });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.summary() });
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
      // Invalidate cart queries since promo affects pricing
      queryClient.invalidateQueries({ queryKey: CART_KEYS.current() });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.summary() });
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
      // Invalidate cart queries since promo removal affects pricing
      queryClient.invalidateQueries({ queryKey: CART_KEYS.current() });
      queryClient.invalidateQueries({ queryKey: CART_KEYS.summary() });
    },
  });
}