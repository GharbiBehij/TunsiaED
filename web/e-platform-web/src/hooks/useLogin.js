// src/hooks/useLogin.js → VERSION CORRIGÉE
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);  // OBLIGATOIRE
    }
  };
  return { submit, isLoading, error };
};