// StudentCourseFilters.jsx - Filter component for student course list
import React from 'react';

export default function StudentCourseFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search courses..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => handleChange('category', e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
      >
        <option value="all">All Categories</option>
        <option value="programming">Programming</option>
        <option value="design">Design</option>
        <option value="business">Business</option>
        <option value="marketing">Marketing</option>
        <option value="data-science">Data Science</option>
      </select>

      {/* Level Filter */}
      <select
        value={filters.level}
        onChange={(e) => handleChange('level', e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
      >
        <option value="all">All Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {/* Price Filter */}
      <select
        value={filters.price}
        onChange={(e) => handleChange('price', e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
      >
        <option value="all">All Prices</option>
        <option value="free">Free</option>
        <option value="paid">Paid</option>
      </select>
    </div>
  );
}
