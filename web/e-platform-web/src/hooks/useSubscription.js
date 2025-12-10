// src/hooks/useSubscription.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SubscriptionService from '../services/SubscriptionService';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_KEYS, PAYMENT_KEYS } from '../core/query/queryKeys';
/**
 * Fetch all subscription plans (public)
 * Cached aggressively since plans rarely change
 */
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.plans(),
    queryFn: SubscriptionService.getSubscriptionPlans,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes (plans rarely change)
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchOnMount: false, // Don't refetch on component mount if data is still fresh
    refetchOnReconnect: false, // Don't refetch on reconnect if data is still fresh
  });
};

/**
 * Fetch a single subscription plan by ID (public)
 * Cached aggressively since individual plans rarely change
 */
export const useSubscriptionPlanById = (planId) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.plan(planId),
    queryFn: () => SubscriptionService.getSubscriptionPlanById(planId),
    enabled: !!planId,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });
};

/**
 * Initiate subscription purchase (authenticated)
 */
export const useInitiateSubscription = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId) => SubscriptionService.initiateSubscription(planId, token),
    onSuccess: () => {
      // Invalidate payment-related queries
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all() });
    },
  });
};
