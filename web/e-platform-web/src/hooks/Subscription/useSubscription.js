// src/hooks/Subscription/useSubscription.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SubscriptionService from '../../services/SubscriptionService';
import { useAuth } from '../../context/AuthContext';
import { SUBSCRIPTION_KEYS, PAYMENT_KEYS } from '../../core/query/queryKeys';

/**
 * Get all subscription plans (public)
 * @returns {UseQueryResult} All subscription plans data
 */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.plans(),
    queryFn: () => SubscriptionService.getSubscriptionPlans(),
    staleTime: 30 * 60 * 1000, // 30 minutes - plans rarely change
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchOnMount: false, // Don't refetch on component mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
}

/**
 * Get subscription plan by ID
 * @param {string} planId - The subscription plan ID
 * @returns {UseQueryResult} Subscription plan data
 */
export function useGetSubscriptionPlanById(planId) {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.plan(planId),
    queryFn: () => SubscriptionService.getSubscriptionPlanById(planId),
    enabled: !!planId,
    staleTime: 30 * 60 * 1000, // 30 minutes - plans rarely change
  });
}

/**
 * Initiate subscription purchase
 * @returns {UseMutationResult} Mutation for initiating subscription
 */
export function useInitiateSubscription() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId) => SubscriptionService.initiateSubscription(planId, token),
    onSuccess: () => {
      // Invalidate payment and subscription related queries
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all() });
    },
  });
}

/**
 * Cancel user's subscription
 * @returns {UseMutationResult} Mutation for canceling subscription
 */
export function useCancelSubscription() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SubscriptionService.cancelSubscription(token),
    onSuccess: () => {
      // Invalidate subscription-related queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all() });
    },
  });
}