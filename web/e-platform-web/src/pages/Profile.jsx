// src/pages/Profile.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useUserProfile, useUpdateProfile } from '../hooks';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profileData, isLoading: profileLoading, isError, error, refetch } = useUserProfile();
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthPlace: '',
    birthDate: '',
    bio: '',
    level: '',
  });

  // Sync form data when profile loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        phone: profileData.phone || '',
        birthPlace: profileData.birthPlace || '',
        birthDate: profileData.birthDate || '',
        bio: profileData.bio || '',
        level: profileData.level || '',
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
      refetch(); // Refresh profile data
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        phone: profileData.phone || '',
        birthPlace: profileData.birthPlace || '',
        birthDate: profileData.birthDate || '',
        bio: profileData.bio || '',
        level: profileData.level || '',
      });
    }
    setIsEditing(false);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading profile...</p>
        </div>
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

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Failed to load profile</p>
          <p className="text-gray-600 mb-4">{error?.message || 'Unknown error'}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData || {};
  const email = user.email;

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
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-lg">{profile.name || 'Not set'}</p>
                )}
              </div>

              {/* Email Address - Read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <p className="text-lg">{email}</p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-lg">{profile.phone || 'Not set'}</p>
                )}
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place of Birth
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter place of birth"
                  />
                ) : (
                  <p className="text-lg">{profile.birthPlace || 'Not set'}</p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birth Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg">
                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'Not set'}
                  </p>
                )}
              </div>

              {/* Learning Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Level
                </label>
                {isEditing ? (
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                ) : (
                  <p className="text-lg capitalize">{profile.level || 'Not set'}</p>
                )}
              </div>

              {/* Account Created - Read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Created
                </label>
                <p className="text-lg">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Bio Section - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Tell us about yourself (max 500 characters)"
                />
              ) : (
                <p className="text-lg whitespace-pre-wrap">
                  {profile.bio || 'No bio added yet'}
                </p>
              )}
              {isEditing && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={updateProfile.isPending}
                    className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
                  >
                    Edit Profile
                  </button>
                  <button className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    Change Password
                  </button>
                </>
              )}
            </div>

            {/* Update Success/Error Message */}
            {updateProfile.isSuccess && !isEditing && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-center">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Profile updated successfully!
                </p>
              </div>
            )}
            {updateProfile.isError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-center">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {updateProfile.error?.message || 'Failed to update profile. Please try again.'}
                </p>
              </div>
            )}
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