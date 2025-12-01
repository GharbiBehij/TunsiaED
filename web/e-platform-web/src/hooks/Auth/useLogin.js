// src/hooks/useLogin.js
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

export const useLogin = () => {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onError: (error) => {
      console.error('Login failed:', error);
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