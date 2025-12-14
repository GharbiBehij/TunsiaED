// src/components/Course/CourseCard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChaptersByCourse, useLessonsByCourse } from '../../hooks';

export default function CourseCard({ course }) {
  const { isAuthenticated } = useAuth();
  const { data: chapters = [] } = useChaptersByCourse(course.courseId);
  const { data: lessons = [] } = useLessonsByCourse(course.courseId);

  return (
    <Link to={`/courses/${course.courseId}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02]">
        {/* Thumbnail with background image */}
        <div 
          className="aspect-video bg-cover bg-center relative group-hover:scale-105 transition-transform duration-300"
          style={{
            backgroundImage: course.thumbnail 
              ? `url(${course.thumbnail})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category badge */}
          {course.category && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary">
              {course.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">person</span>
            {course.instructorName}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Course Content Stats */}
          {(chapters.length > 0 || lessons.length > 0) && (
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              {chapters.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-base text-primary">menu_book</span>
                  <span className="font-medium">{chapters.length}</span>
                  <span>chapter{chapters.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {lessons.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-base text-primary">play_circle</span>
                  <span className="font-medium">{lessons.length}</span>
                  <span>lesson{lessons.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-between items-center text-sm mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{course.rating || 'New'}</span>
              </span>
              {course.duration && (
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {course.duration}h
                </span>
              )}
            </div>
            <span className="font-bold text-lg text-primary">
              {course.price === 0 ? 'Free' : `${course.price} TND`}
            </span>
          </div>

          {/* CTA */}
          <button className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200">
            {isAuthenticated ? 'Enroll Now' : 'View Details'}
          </button>
        </div>
      </div>
    </Link>
  );
}