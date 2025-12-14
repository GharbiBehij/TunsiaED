// src/components/Dashboard/StudentDashboard/StudentCoursesList.jsx
import React, { useState } from 'react';
import StudentCourseFilters from './StudentCourseFilters';
import CourseCard from './CourseCard';

export default function StudentCourseList({ courses = [] }) {
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    price: 'all',
    search: ''
  });

  const filteredCourses = courses.filter(course => {
    if (filters.category !== 'all' && course.category !== filters.category) return false;
    if (filters.level !== 'all' && course.level !== filters.level) return false;
    if (filters.price === 'free' && course.price > 0) return false;
    if (filters.price === 'paid' && course.price === 0) return false;
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  if (!courses || courses.length === 0) {
    return <p className="text-center text-gray-500 py-10">No courses found</p>;
  }
  return (
    <div className="flex flex-col gap-6">
      <StudentCourseFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
