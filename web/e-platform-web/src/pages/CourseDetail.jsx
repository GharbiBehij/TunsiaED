// src/pages/CourseDetail.jsx - Course details with enrollment flow
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseById } from '../hooks/Course/useCourse';
import { useAuth } from '../context/AuthContext';
import { useInitiatePurchase } from '../hooks/Payment/usePayment';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isStudent } = useAuth();
  const { data: course, isLoading, isError } = useCourseById(courseId);
  const initiatePurchase = useInitiatePurchase();
  const [enrollmentMethod, setEnrollmentMethod] = useState(null); // 'purchase' | 'subscription'

  const handleEnroll = async (method) => {
    if (!isAuthenticated) {
      // Redirect to signup with return URL
      navigate(`/signup?redirect=/courses/${courseId}`);
      return;
    }

    if (!isStudent) {
      alert('Only students can enroll in courses');
      return;
    }

    setEnrollmentMethod(method);

    if (method === 'purchase') {
      // Direct course purchase
      try {
        const result = await initiatePurchase.mutateAsync({
          courseId,
          paymentType: 'course_purchase',
          paymentMethod: 'paymee', // Default to Paymee for Tunisia
        });
        
        // Redirect to payment page with payment ID
        navigate(`/payment/${result.paymentId}`);
      } catch (error) {
        console.error('Failed to initiate purchase:', error);
        alert('Failed to start enrollment. Please try again.');
        setEnrollmentMethod(null);
      }
    } else if (method === 'subscription') {
      // Redirect to subscription page
      navigate('/subscription');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const isFree = !course.price || course.price === 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link to="/courses" className="text-white/80 hover:text-white transition text-sm">
                ← Back to Courses
              </Link>
            </div>

            {/* Course Title & Instructor */}
            <h1 className="text-4xl md:text-5xl font-black mb-4">{course.title}</h1>
            <p className="text-xl text-white/90 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">person</span>
                <span>By {course.instructorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">schedule</span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">bar_chart</span>
                <span className="capitalize">{course.level}</span>
              </div>
              {course.rating > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300">★</span>
                  <span>{course.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  What You'll Learn
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    This course will provide you with comprehensive knowledge and hands-on experience in {course.title.toLowerCase()}.
                    Perfect for {course.level} learners looking to advance their skills.
                  </p>
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list</span>
                  Course Content
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Structured curriculum with chapters, lessons, and quizzes. Certificate upon completion.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="material-symbols-outlined text-primary">folder</span>
                    <span className="text-gray-700 dark:text-gray-300">Multiple Chapters</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="material-symbols-outlined text-primary">play_circle</span>
                    <span className="text-gray-700 dark:text-gray-300">Video Lessons (Coming in V2)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="material-symbols-outlined text-primary">quiz</span>
                    <span className="text-gray-700 dark:text-gray-300">Interactive Quizzes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                    <span className="text-gray-700 dark:text-gray-300">Certificate of Completion</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  Requirements
                </h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check</span>
                    <span>Basic understanding of {course.category.toLowerCase()}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check</span>
                    <span>Internet connection and computer access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check</span>
                    <span>Commitment to complete the course</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-primary shadow-lg sticky top-24">
                {/* Thumbnail */}
                {course.thumbnail && (
                  <div className="mb-6">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  {isFree ? (
                    <div className="text-4xl font-bold text-green-600">Free</div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-bold text-primary">{course.price} TND</div>
                      <div className="text-gray-500 dark:text-gray-400 line-through text-lg">
                        {Math.round(course.price * 1.3)} TND
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {course.enrolledCount || 0} students enrolled
                  </p>
                </div>

                {/* Enrollment Options */}
                <div className="space-y-3 mb-6">
                  {isFree ? (
                    <button
                      onClick={() => handleEnroll('purchase')}
                      disabled={initiatePurchase.isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {initiatePurchase.isPending ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">progress_activity</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">school</span>
                          Enroll for Free
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEnroll('purchase')}
                        disabled={initiatePurchase.isPending}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {initiatePurchase.isPending && enrollmentMethod === 'purchase' ? (
                          <>
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">shopping_cart</span>
                            Buy Course
                          </>
                        )}
                      </button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnroll('subscription')}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition"
                      >
                        <span className="material-symbols-outlined">card_membership</span>
                        Get Subscription
                      </button>
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        Access this course + entire library for 29 TND/month
                      </p>
                    </>
                  )}
                </div>

                {/* Course Features */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">This course includes:</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-primary">all_inclusive</span>
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                    <span>Instructor support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-primary">devices</span>
                    <span>Access on all devices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
