// src/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'idle' });

  const handleLogin = async (email,password) => {
    setState({ status: 'loading' });
    try {
      const res = await fetch("${BFF_BASE_URL}/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email.password)
      });
      await login(email, password);
      setState({ status: 'success' });
      setTimeout(() => navigate('/'), 100);
    } catch (error) {
      setState({
        status: 'error',
        message: error?.message || 'Login failed',
      });
    }
  };

  return {
    handleLogin,
    state,
  };
};

