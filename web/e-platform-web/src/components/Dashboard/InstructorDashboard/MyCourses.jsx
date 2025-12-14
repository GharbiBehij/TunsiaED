// src/components/Dashboard/InstructorDashboard/MyCourses.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteCourse } from '../../../hooks';

export default function MyCourses({ data: courses, isLoading, isError }) {
  const deleteCourse = useDeleteCourse();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(courseId);
    try {
      await deleteCourse.mutateAsync(courseId);
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Courses</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined">error</span>
          <p>Failed to load your courses. Please try again.</p>
        </div>
      </div>
    );
  }

  const courseList = courses || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Courses</h2>
        <Link
          to="/instructor/new-course"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Course
        </Link>
      </div>

      {courseList.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">school</span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create your first course to get started
          </p>
          <Link
            to="/instructor/new-course"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courseList.map(course => (
            <div
              key={course.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate mb-1">
                  {course.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">category</span>
                    {course.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">group</span>
                    {course.enrolledCount || 0} students
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    {course.price > 0 ? `${course.price} TND` : 'Free'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/courses/${course.id}`}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                  title="View Course"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </Link>
                <button
                  onClick={() => console.log('Edit course:', course.id)}
                  className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                  title="Edit Course"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  disabled={deletingId === course.id}
                  className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Course"
                >
                  {deletingId === course.id ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined">delete</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
