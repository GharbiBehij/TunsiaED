// src/pages/Profile.jsx
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">You are not logged in</p>
      </div>
    );
  }

  const { profile = {}, email, uid } = user;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-text-light dark:text-text-dark text-lg">Manage your account information</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-neutral-light/20 dark:border-neutral-dark/20 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-blue-700 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="size-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold border-4 border-white">
                {profile.name?.[0] || email[0].toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">{profile.name || 'No name set'}</h2>
                <p className="text-lg opacity-90">{email}</p>
                <div className="mt-2">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    profile.role === 'instructor'
                      ? 'bg-yellow-500 text-yellow-900'
                      : profile.role === 'admin'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {profile.role === 'instructor' ? 'Instructor' : 
                     profile.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <p className="text-lg">{profile.name || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <p className="text-lg">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <p className="text-lg">{profile.phone || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place of Birth
                </label>
                <p className="text-lg">{profile.birthPlace || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birth Date
                </label>
                <p className="text-lg">{profile.birthDate || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Created
                </label>
                <p className="text-lg">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
              >
                Edit Profile
              </button>
              <button className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Instructor Pending Message */}
        {profile.role === 'instructor' && !profile.approved && (
          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl text-center">
            <p className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
              Your instructor application is under review.
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 mt-2">
              You can explore the platform while we review your CV.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}