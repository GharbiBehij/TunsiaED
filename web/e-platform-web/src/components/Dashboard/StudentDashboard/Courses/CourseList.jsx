// src/components/Course/StudentCourseList.jsx
import React from 'react';
import CourseCard from './CourseCard';

export default function StudentCourseList({ courses }) {
  if (!courses || courses.length === 0) {
    return <p className="text-[#617589] text-center">You have no courses yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
