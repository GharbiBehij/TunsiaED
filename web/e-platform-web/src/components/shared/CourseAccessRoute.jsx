// src/components/shared/CourseAccessRoute.jsx
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCourseById, useMyEnrollments } from '../../hooks';

/**
 * CourseAccessRoute - Enforces course access control
 * Grants access if:
 * - Course is free
 * - User has active subscription (for system courses)
 * - User is enrolled in the course
 * - User is admin
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 */
export default function CourseAccessRoute({ children }) {
  const { courseId } = useParams();
  const { isAuthenticated, isLoading: authLoading, hasActiveSubscription, isAdmin } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourseById(courseId);
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useMyEnrollments();

  // Show loading state
  if (authLoading || courseLoading || enrollmentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: `/courses/${courseId}` }} replace />;
  }

  // Course not found
  if (!course) {
    return <Navigate to="/course" replace />;
  }

  // Admins always have access
  if (isAdmin) {
    return children;
  }

  // Free courses are accessible to everyone
  const isFree = !course.price || course.price === 0;
  if (isFree) {
    return children;
  }

  // Check if user is enrolled
  const isEnrolled = enrollments.some(e => e.courseId === courseId);
  if (isEnrolled) {
    return children;
  }

  // Check subscription access for system courses
  if (course.isSystemCourse && hasActiveSubscription) {
    return children;
  }

  // No access - redirect to course detail page for purchase
  return (
    <Navigate 
      to={`/courses/${courseId}`} 
      state={{ 
        message: 'Please enroll in this course or subscribe to access the content.',
        requiresAccess: true
      }} 
      replace 
    />
  );
}
