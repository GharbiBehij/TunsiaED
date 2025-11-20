// src/components/auth/Signup/Signup.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentForm from './forms/StudentForm';
import InstructorForm from './forms/InstructorForm';

export default function Signup() {
  const [role, setRole] = useState('student');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">
      
      {/* --- NEW: Back to Home Link (Top Left) --- */}
      <Link
        to="/"
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </Link>

      <div className="flex h-full w-full max-w-md flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">

          {/* Logo & App Name (Now Clickable - Redirects to Home) */}
          <Link to="/" className="flex flex-col items-center gap-3 group hover:opacity-90 transition-opacity">
            <svg
              className="text-primary"
              fill="none"
              height="56"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="56"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              TunisiaED
            </h2>
          </Link>

          {/* Title */}
          <div className="text-center mt-8">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-white">
              Create Your Account
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Start your journey with TunisiaED
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="space-y-8">

            {/* Role Toggle with Sliding Background */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-0 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                {/* Sliding Indicator */}
                <div
                  className="absolute top-1 left-1 h-10 w-1/2 rounded-md bg-primary transition-transform duration-300 ease-in-out"
                  style={{
                    transform: role === 'student' ? 'translateX(0%)' : 'translateX(100%)',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`relative z-10 h-10 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    role === 'student'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Sign up as a Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`relative z-10 h-10 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    role === 'instructor'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Sign up as an Instructor
                </button>
              </div>
            </div>

            {/* Forms Container */}
            <div className="mt-2">
              {role === 'student' ? <StudentForm /> : <InstructorForm />}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background-light dark:bg-background-dark px-4 text-gray-500">
                  OR
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-base font-semibold text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="h-5 w-5"
              />
              Sign up with Google
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 underline-offset-4 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}