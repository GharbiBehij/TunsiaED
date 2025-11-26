// src/components/Course/CourseList.jsx
import CourseCard from './CourseCard';

export default function CourseList({ courses }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-500">No courses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}