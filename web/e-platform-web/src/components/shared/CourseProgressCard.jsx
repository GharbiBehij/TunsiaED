// Reusable CourseProgressCard component for all dashboards
import { Link } from 'react-router-dom';

/**
 * CourseProgressCard - Reusable course progress card component
 * @param {Object} course - Course object
 * @param {string} variant - Display variant (list, card, student-progress)
 * @param {string} viewAllLink - Optional link to view all courses
 * @param {string} role - User role (student, instructor, admin)
 */
export default function CourseProgressCard({ course, variant = 'list', viewAllLink, role = 'student' }) {
  const getBarColor = (color) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-500';
      case 'amber':
        return 'bg-amber-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-primary';
    }
  };

  // Student progress variant (for enrolled courses)
  if (variant === 'student-progress') {
    const progress = course.progress || 0;
    const completedLessons = course.completedLessons?.length || 0;
    const totalLessons = course.totalLessons || 0;

    return (
      <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-base text-[#111418] truncate">{course.title || course.courseTitle}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {completedLessons} / {totalLessons} lessons completed
            </p>
          </div>
          {course.completed && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              Completed
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-[#111418]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {course.enrolledAt && (
          <p className="text-xs text-gray-500">
            Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  // Instructor view for student progress tracking
  if (variant === 'instructor-student-progress') {
    const progress = course.progress || 0;

    return (
      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {course.studentName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm text-[#111418]">{course.studentName || 'Unknown Student'}</p>
              <p className="text-xs text-gray-500">{course.studentEmail || ''}</p>
            </div>
          </div>
          {course.completed && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              ✓ Completed
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-[#111418]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${getBarColor(progress >= 100 ? 'green' : 'blue')} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {course.enrolledAt && (
          <p className="text-xs text-gray-400 mt-2">
            Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    const percentage = Math.round((course.enrolled / course.capacity) * 100);

    return (
      <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-4 bg-white shadow-sm">
        <h3 className="font-bold text-base text-[#111418] truncate">{course.title}</h3>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Enrollment</span>
          <span className="font-medium text-[#111418]">
            {course.enrolled} / {course.capacity}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getBarColor(course.color)} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {course.revenue !== undefined && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-600">Revenue</span>
            <span className="font-semibold text-lg text-green-600">
              ${course.revenue.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    );
  }

  // List variant (default)
  return (
    <div>
      <div className="flex justify-between mb-1">
        <p className="text-sm font-medium">{course.title}</p>
        <p className="text-sm">{course.students} Students</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

/**
 * CoursePerformanceList - Wrapper component for displaying multiple course progress cards
 */
export function CoursePerformanceList({ courses = [], isLoading, variant = 'list', viewAllLink, title = 'Course Performance', role = 'student' }) {
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-10">No courses found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {viewAllLink && (
          <Link className="text-sm font-medium text-[#1380ec] hover:underline" to={viewAllLink}>
            View All
          </Link>
        )}
      </div>
      {variant === 'card' || variant === 'student-progress' || variant === 'instructor-student-progress' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseProgressCard 
              key={course.id || course.enrollmentId || index} 
              course={course} 
              variant={variant} 
              role={role}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <CourseProgressCard 
              key={course.id || course.enrollmentId || index} 
              course={course} 
              variant="list"
              role={role}
            />
          ))}
        </div>
      )}
    </div>
  );
}

