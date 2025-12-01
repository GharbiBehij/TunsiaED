// src/components/Dashboard/StudentDashboard/StudentCoursesList.jsx
import React, { useState } from 'react';
import { useCourses } from '../../../../hooks/Course/useCourses';
import StudentCourseFilters from './StudentCourseFilters';
import CourseCard from './CourseCard';

export default function StudentCoursesList() {
  const { data: courses = [], isLoading } = useCourses();
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

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
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
