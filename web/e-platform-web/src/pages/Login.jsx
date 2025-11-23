// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { submit, isLoading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(email, password);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">

      <Link to="/" className="absolute top-4 left-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path d="M10.5 19.5L3 12l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Home
      </Link>

      <div className="w-full max-w-md px-6">
        
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">TunisiaED</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Welcome Back!</h1>
        </div>

        <div className="bg-white dark:bg-neutral-dark/40 rounded-xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label className="label">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {error}
              </div>
            )}

            <button disabled={isLoading} className="btn-primary w-full">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-8 text-center text-sm text-gray-500">OR</div>

          <GoogleLoginButton />

          <p className="mt-8 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-bold text-primary">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}