// components/CoursesGrid.jsx
import React from "react";
import CourseCard from "./CourseCard";

export default function CoursesGrid({ courses }) {
  if (!courses || courses.length === 0) {
    return <p className="text-[#617589] text-center">No courses available</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
