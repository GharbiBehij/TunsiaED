// src/hooks/useCreatePromotion.js
import { useMutation } from '@tanstack/react-query';
import AdminService from '../services/AdminService';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const useCreatePromotion = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promoData) => AdminService.createPromotion(token, promoData),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-promotions']);
    },
  });
};