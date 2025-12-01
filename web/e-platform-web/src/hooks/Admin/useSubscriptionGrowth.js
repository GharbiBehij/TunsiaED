// src/hooks/useSubscriptionGrowth.js
import { useQuery } from '@tanstack/react-query';
import AdminService from '../services/AdminService';
import { useAuth } from '../context/AuthContext';

export const useSubscriptionGrowth = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['subscription-growth'],
    queryFn: () => AdminService.getSubscriptionGrowth(token),
    enabled: !!token,
    refetchInterval: 60_000,
  });
};