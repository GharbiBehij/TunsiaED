// src/pages/Signup.jsx
import { useState } from 'react';
import { Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';

export default function Signup() {
  const [role, setRole] = useState('student');
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Save role + extra data temporarily
    const extraData = {
      name: data.name,
      phone: data.phone,
      birthPlace: data.birthPlace,
      birthDate: data.birthDate,
      role,
      cv: role === 'instructor' ? formData.get('cv') : null,
    };

    localStorage.setItem('pendingProfile', JSON.stringify(extraData));

    try {
      await signup({ email: data.email, password: data.password });
      // onAuthStateChanged will handle the rest
    } catch (err) {
      // error already shown by useAuth
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">
      <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </Link>

      <div className="flex h-full w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h2 className="text-4xl font-bold text-primary">TunisiaED</h2>
          </Link>
          <h1 className="text-3xl font-bold mt-6">Create Your Account</h1>
          <p className="text-gray-500 mt-2">Join Tunisia's learning revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Toggle */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            <div className={`absolute top-1 left-1 h-10 w-1/2 bg-primary rounded-md transition-transform ${role === 'instructor' ? 'translate-x-full' : ''}`} />
            <button type="button" onClick={() => setRole('student')} className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-md transition ${role === 'student' ? 'text-white' : 'text-gray-600'}`}>
              Student
            </button>
            <button type="button" onClick={() => setRole('instructor')} className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-md transition ${role === 'instructor' ? 'text-white' : 'text-gray-600'}`}>
              Instructor
            </button>
          </div>

          {/* Shared Fields */}
          <input name="name" type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
          <input name="email" type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
          <input name="password" type="password" placeholder="Password (6+ characters)" required minLength="6" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
          <input name="phone" type="tel" placeholder="Phone Number" required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
          <input name="birthPlace" type="text" placeholder="Place of Birth" required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
          <input name="birthDate" type="date" required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />

          {/* CV for Instructor */}
          {role === 'instructor' && (
            <div>
              <label className="block text-sm font-medium mb-2">Upload Your CV (PDF/DOC)</label>
              <input name="cv" type="file" accept=".pdf,.doc,.docx" required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white" />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-70 transition"
          >
            {isLoading ? 'Creating Account...' : role === 'student' ? 'Sign Up as Student' : 'Apply as Instructor'}
          </button>
        </form>

        <div className="my-8 text-center text-sm text-gray-500">OR</div>
        <GoogleLoginButton />

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}