// src/pages/Courses.jsx
import { useState } from 'react';
import { useAllCourses } from '../hooks';
import CourseList from '../components/Courses/CourseList';
import CourseFilters from '../components/Courses/CourseFilters';
import Header from '../components/home/Header/Header';

export default function Courses() {
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    price: 'all',
    search: ''
  });

  const { data: courses = [], isLoading } = useAllCourses();

  // Filter logic (client-side)
  const filteredCourses = courses.filter(course => {
    if (filters.category !== 'all' && course.category !== filters.category) return false;
    if (filters.level !== 'all' && course.level !== filters.level) return false;
    if (filters.price === 'free' && course.price > 0) return false;
    if (filters.price === 'paid' && course.price === 0) return false;
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-72 p-6 border-r border-neutral-light/10 dark:border-neutral-dark/10 hidden lg:block">
          <CourseFilters filters={filters} onChange={setFilters} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black mb-8">Explore Our Courses</h1>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <CourseList courses={filteredCourses} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}