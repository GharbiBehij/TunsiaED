// src/components/Course/CourseList.jsx
import CourseCard from './CourseCard';
import { useAllCourses } from '../../hooks';

export default function CourseList({ courses: propCourses }) {
  // Use dynamic data if courses not provided via props
  const { data: fetchedCourses, isLoading, isError } = useAllCourses();
  const courses = propCourses || fetchedCourses || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500">Failed to load courses. Please try again.</p>
      </div>
    );
  }

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
        <CourseCard key={course.courseId || course.id} course={course} />
      ))}
    </div>
  );
}