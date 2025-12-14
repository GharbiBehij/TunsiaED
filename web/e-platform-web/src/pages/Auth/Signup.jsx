// src/pages/Signup.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleLoginButton from '../../components/Auth/GoogleLoginButton';

export default function Signup() {
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validate password length
    if (data.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // ✅ FIX: Store extra profile data BEFORE authentication
    // Use 'data' object and 'role' state variable
    const extraData = {
      name: data.name,
      phone: data.phone,
      birthPlace: data.birthPlace,
      birthDate: data.birthDate,
      role: role,  // ← Use the state variable, not formData.role
      cv: role === 'instructor' ? data.cv : null,
    };

    console.log('💾 Saving to localStorage:', extraData);
    localStorage.setItem("pendingProfile", JSON.stringify(extraData));

    try {
      await signup({ email: data.email, password: data.password });
      // Navigation handled by AuthContext
    } catch (err) {
      console.error("Signup failed:", err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition"
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

      <div className="flex h-full w-full max-w-md flex-col justify-center px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h2 className="text-4xl font-bold text-primary">TunisiaED</h2>
          </Link>
          <h1 className="text-3xl font-bold mt-6">Create Your Account</h1>
          <p className="text-gray-500 mt-2">Join Tunisia's learning revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ROLE SWITCH */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            <div
              className={`absolute top-1 left-1 h-10 w-1/2 bg-primary rounded-md transition-transform duration-200 ${
                role === "instructor" ? "translate-x-full" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition ${
                role === "student" ? "text-white" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition ${
                role === "instructor" ? "text-white" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Instructor
            </button>
          </div>

          {/* Form Fields */}
          <input 
            name="name" 
            required 
            placeholder="Full Name" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            disabled={isLoading}
          />
          
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="Email Address" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            disabled={isLoading}
          />
          
          <input 
            name="password" 
            type="password" 
            required 
            minLength={6}
            placeholder="Password (min 6 characters)" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            disabled={isLoading}
          />
          
          <input 
            name="phone" 
            required 
            placeholder="Phone Number" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            disabled={isLoading}
          />
          
          <input 
            name="birthPlace" 
            required 
            placeholder="Place of Birth" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            disabled={isLoading}
          />
          
          <input 
            name="birthDate" 
            type="date" 
            required 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            disabled={isLoading}
          />

          {role === 'instructor' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Upload CV (PDF, DOC, DOCX)
              </label>
              <input 
                name="cv" 
                type="file" 
                accept=".pdf,.doc,.docx" 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading} 
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Creating Account..."
              : role === "student"
              ? "Sign Up as Student"
              : "Apply as Instructor"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-sm text-gray-500">OR</div>

        {/* Google Sign Up */}
        <GoogleLoginButton />

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}