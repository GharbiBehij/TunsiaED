import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useSignup = () => {
  const {signup} = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({ 
    status: 'idle',
    error:null
   });

  const handleSignup = async (formData)=> {
     setState({ status: 'loading',error:null });
     try {
        const res = await fetch("${BFF_BASE_URL}/api/v1/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Signup failed");
        }
        setState({ status: 'success', error: null });
        setTimeout(() => navigate('/login'), 300);
      } catch (error) {
        setState({
          status: 'error',
          error: error.message || "Signup failed"
        });
      }
    };
  
    return {
      handleSignup,
      state,
      isLoading: state.status === 'loading',
      isSuccess: state.status === 'success',
      isError: state.status === 'error',
      error: state.error,
    };
  };