// src/components/Course/CourseCard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function CourseCard({ course }) {
  const { isAuthenticated } = useAuth();

  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary to-blue-600"></div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            by {course.instructorName}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {course.rating || 'New'}
              </span>
              <span>{course.duration}h</span>
            </div>
            <span className="font-bold text-primary">
              {course.price === 0 ? 'Free' : `${course.price} TND`}
            </span>
          </div>

          {/* CTA */}
          <button className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition">
            {isAuthenticated ? 'Enroll Now' : 'View Details'}
          </button>
        </div>
      </div>
    </Link>
  );
}