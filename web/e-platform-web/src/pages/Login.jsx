// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ← This is the only change: use the clean hook
  const { submit, isLoading, error } = useLogin();

  const onSubmit = async (e) => {
    e.preventDefault();
    await submit(email, password);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">
      
      <Link
        to="/"
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </Link>

      <div className="flex h-full w-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <Link to="/" className="flex justify-center items-center gap-3 mb-4 group hover:opacity-90 transition-opacity">
              <div className="text-primary">
                <svg className="size-12" fill="currentColor" viewBox="0 0 48 48">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-primary">TunisiaED</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Welcome Back!</h1>
            <p className="text-text-light/70 dark:text-text-dark/70 mt-2">Log in to continue your learning journey</p>
          </div>

          <div className="bg-white dark:bg-neutral-dark/40 rounded-2xl shadow-xl border border-neutral-light/20 dark:border-neutral-dark/20 p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-light/30 dark:border-neutral-dark/30 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-light/30 dark:border-neutral-dark/30 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark pr-12 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light/60 dark:text-text-dark/60 hover:text-primary transition"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Error from Firebase */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-light/30 dark:border-neutral-dark/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-background-dark text-text-light/60 dark:text-text-dark/60">OR</span>
              </div>
            </div>


            <GoogleLoginButton />

            <p className="text-center mt-8 text-sm text-text-light/70 dark:text-text-dark/70">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;