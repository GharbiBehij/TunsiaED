// src/pages/Instructor/CreateCourse.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCourse } from '../../hooks';

const CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Mathematics',
  'Science',
  'Languages',
  'Arts',
  'Music',
  'Health',
  'Engineering',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCourse() {
  const navigate = useNavigate();
  const createCourseMutation = useCreateCourse();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
    duration: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    if (formData.thumbnail && !isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = 'Please enter a valid URL';
    }
    
    if (formData.duration && formData.duration < 0) {
      newErrors.duration = 'Duration cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare course data
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        level: formData.level,
        price: Number(formData.price),
        thumbnail: formData.thumbnail.trim() || null,
        duration: formData.duration || 0,
      };

      await createCourseMutation.mutateAsync(courseData);
      
      // Success! Navigate to instructor dashboard
      navigate('/pages/instructor/instructordashboard');
    } catch (error) {
      console.error('Failed to create course:', error);
      setErrors({ submit: error.message || 'Failed to create course. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/pages/instructor/instructordashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Course</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Fill in the details below to create your course. It will automatically appear in the course catalog.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          
          {/* Course Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete Web Development Bootcamp"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.title 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-primary'
              } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Course Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe what students will learn in this course..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-primary'
              } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition resize-none`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.description}
              </p>
            )}
          </div>

          {/* Category and Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.category 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-primary'
                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Difficulty Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                {LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Price (TND)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.price 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-primary'
                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.price}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Set to 0 for free courses</p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                step="0.5"
                placeholder="e.g., 10"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.duration 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-primary'
                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.duration}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Estimated completion time</p>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/course-thumbnail.jpg"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.thumbnail 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-primary'
              } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition`}
            />
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.thumbnail}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Optional: Add a thumbnail image for your course</p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">add_circle</span>
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">What happens next?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Once you create your course, it will automatically appear in the course catalog. 
                You can then add chapters, lessons, and quizzes to build out your course content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
