// src/hooks/useNotifications.js — THE ONLY ONE
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  removeNotification as apiRemoveNotification,
  markAllAsRead as apiMarkAllAsRead 
} from '../services/NotificationService';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { 
    data: notifications = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    staleTime: 1000 * 60,
    refetchInterval: 30_000,
  });

  const removeMutation = useMutation({
    mutationFn: apiRemoveNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: apiMarkAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return {
    notifications,
    isLoading,
    isError,
    refetch,
    removeNotification: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    markAllAsRead: markAllMutation.mutate,
    isMarkingAll: markAllMutation.isPending,
  };
};