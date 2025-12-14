// src/components/FeaturedCourses/FeaturedCourses.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useSystemCourses } from '../../../hooks';
import { useAuth } from '../../../context/AuthContext';

export default function FeaturedCourses() {
  const navigate = useNavigate();
  const { hasActiveSubscription } = useAuth();
  const { data: courses = [], isLoading, error } = useSystemCourses();

  // Show first 6 system courses
  const featuredCourses = courses.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Featured Courses
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-text-light/70 dark:text-text-dark/70">Loading courses...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Featured Courses
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Failed to load courses. Please try again later.</div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredCourses.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Featured Courses
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-text-light/70 dark:text-text-dark/70">No courses available yet.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Featured Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.courseId}
              className="group flex flex-col bg-white dark:bg-background-dark rounded-xl overflow-hidden border border-neutral-light/20 dark:border-neutral-dark/20 transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
              onClick={() => navigate(`/courses/${course.courseId}`)}
            >
              <div
                className="w-full h-48 bg-cover bg-center transition-transform group-hover:scale-105"
                style={{ 
                  backgroundImage: course.thumbnail 
                    ? `url(${course.thumbnail})` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
                aria-hidden="true"
              />
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
                    {course.category || 'Technology'}
                  </span>
                  {course.price !== undefined && (
                    <span className="text-lg font-bold text-primary">
                      {course.price === 0 ? 'Free' : `${course.price} TND`}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-text-light/70 dark:text-text-dark/70 flex-grow line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-text-light/60 dark:text-text-dark/60">
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      {course.duration}h
                    </span>
                  )}
                  {course.level && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">signal_cellular_alt</span>
                      {course.level}
                    </span>
                  )}
                </div>
                <button 
                  className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    if (course.isSystemCourse && hasActiveSubscription) {
                      navigate(`/courses/${course.id}/learn`);
                    } else {
                      navigate(`/courses/${course.id}`);
                    }
                  }}
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length > 6 && (
          <div className="flex justify-center mt-12">
            <Link
              to="/courses"
              className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors"
            >
              View All Courses
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}