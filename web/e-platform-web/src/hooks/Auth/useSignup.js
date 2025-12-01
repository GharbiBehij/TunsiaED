// src/hooks/useSignup.js
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

export const useSignup = () => {
  const { signup } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ email, password }) => signup({ email, password }),
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });

  return {
    submit: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};