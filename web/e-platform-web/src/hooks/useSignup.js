// src/hooks/useSignup.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useSignup = () => { 
  const { signup } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (email, password) => {  // ← paramètres corrects
    setIsLoading(true);
    setError(null);
    try {
      await signup({ email, password });  // ← direct, propre
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };
  return { submit, isLoading, error };
};