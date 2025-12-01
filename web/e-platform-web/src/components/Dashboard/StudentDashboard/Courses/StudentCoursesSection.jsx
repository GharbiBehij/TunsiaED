// Student Courses Section - Wrapper component for student courses widget
import React from 'react';
import StudentCourseList from './CourseList';

export default function StudentCoursesSection({ data: courses = [], isLoading, showTitle = true, title = 'My Courses' }) {

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {showTitle && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <StudentCourseList courses={courses} />
    </>
  );
}

