// src/hooks/useUpdateSubscriptionPlan.js
import { useMutation } from '@tanstack/react-query';
import AdminService from '../services/AdminService';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const useUpdateSubscriptionPlan = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData) => AdminService.updateSubscriptionPlan(token, planData),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscription-plans']);
    },
  });
};