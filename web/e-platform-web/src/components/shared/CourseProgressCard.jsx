// Reusable CourseProgressCard component for all dashboards
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CourseProgressCard - Reusable course progress card component
 * @param {Object} course - Course object
 * @param {string} variant - Display variant (list, card)
 * @param {string} viewAllLink - Optional link to view all courses
 */
export default function CourseProgressCard({ course, variant = 'list', viewAllLink }) {
  const getBarColor = (color) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-500';
      case 'amber':
        return 'bg-amber-500';
      case 'blue':
        return 'bg-blue-500';
      default:
        return 'bg-primary';
    }
  };

  if (variant === 'card') {
    const percentage = Math.round((course.enrolled / course.capacity) * 100);

    return (
      <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-4 bg-white shadow-sm">
        <h3 className="font-bold text-base text-[#111418] truncate">{course.title}</h3>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Enrollment</span>
          <span className="font-medium text-[#111418]">
            {course.enrolled} / {course.capacity}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getBarColor(course.color)} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {course.revenue !== undefined && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-600">Revenue</span>
            <span className="font-semibold text-lg text-green-600">
              ${course.revenue.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    );
  }

  // List variant (default)
  return (
    <div>
      <div className="flex justify-between mb-1">
        <p className="text-sm font-medium">{course.title}</p>
        <p className="text-sm">{course.students} Students</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

/**
 * CoursePerformanceList - Wrapper component for displaying multiple course progress cards
 */
export function CoursePerformanceList({ courses = [], isLoading, variant = 'list', viewAllLink }) {
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Course Performance</h3>
        {viewAllLink && (
          <Link className="text-sm font-medium text-[#1380ec] hover:underline" to={viewAllLink}>
            View All Courses
          </Link>
        )}
      </div>
      {variant === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseProgressCard key={course.id} course={course} variant="card" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseProgressCard key={course.id} course={course} variant="list" />
          ))}
        </div>
      )}
    </div>
  );
}

