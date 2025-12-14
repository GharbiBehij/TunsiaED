// src/pages/CourseDetail.jsx - Course details with enrollment flow
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartContext as useCart } from '../context/CartContext';
import { useCourseById, useChaptersByCourse, useLessonsByCourse, useInitiatePurchase, useEnrollInCourse } from '../hooks';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  console.log('📋 [CourseDetail] courseId from params:', courseId);
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, hasActiveSubscription } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { data: course, isLoading, isError } = useCourseById(courseId);
  const { data: chapters = [], isLoading: chaptersLoading } = useChaptersByCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessonsByCourse(courseId);
  const initiatePurchase = useInitiatePurchase();
  const enrollInCourse = useEnrollInCourse();
  const [enrollmentMethod, setEnrollmentMethod] = useState(null); // 'purchase' | 'subscription'
  const [expandedChapters, setExpandedChapters] = useState({});

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleAddToCart = () => {
    if (course) {
      addToCart(course);
      navigate('/cart');
    }
  };

  // Group lessons by chapter
  const lessonsByChapter = lessons.reduce((acc, lesson) => {
    const key = lesson.chapterId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(lesson);
    return acc;
  }, {});

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

    // Check if user has subscription access for system courses
    if (course.isSystemCourse && course.price > 0 && hasActiveSubscription) {
      // User has subscription, grant access directly
      alert('You have access to this course through your subscription! Redirecting to course content...');
      navigate(`/pages/student/studentdashboard`);
      return;
    }
    setEnrollmentMethod(method);
    if (method === 'purchase') {
      const isFree = !course.price || course.price === 0;
      if (isFree) {
        // Free course - enroll directly without payment
        try {
          await enrollInCourse.mutateAsync({ courseId });

          // Success - redirect to course dashboard or show success message
          alert('Successfully enrolled! You can now access the course.');
          navigate(`/pages/student/studentdashboard`);
        } catch (error) {
          console.error('Failed to enroll in free course:', error);
          alert(error.message || 'Failed to enroll. Please try again.');
          setEnrollmentMethod(null);
        }
      } else {
        // Paid course - go through payment flow
        try {
          const result = await initiatePurchase.mutateAsync({
            courseId,
            paymentType: 'course_purchase',
            paymentMethod: 'stripe', // Default to Stripe
          });
          console.log('💳 [CourseDetail] Purchase initiated:', result);
          
          // Validate paymentId before navigation
          const paymentId = result.paymentId;
          if (!paymentId) {
            console.error('❌ [CourseDetail] Missing paymentId from initiatePurchase result:', result);
            throw new Error('Payment ID not returned from server');
          }
          
          console.log('💳 [CourseDetail] Navigating to payment:', paymentId);
          // Redirect to payment page with payment ID
          navigate(`/payment/${paymentId}`);
        } catch (error) {
          console.error('Failed to initiate purchase:', error);
          alert('Failed to start enrollment. Please try again.');
          setEnrollmentMethod(null);
        }
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

              {/* Course Content - Chapters & Lessons */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list</span>
                  Course Content
                </h2>
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">folder</span>
                    {chapters.length} chapters
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">play_circle</span>
                    {lessons.length} lessons
                  </span>
                </div>

                {chaptersLoading || lessonsLoading ? (
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ) : chapters.length > 0 ? (
                  <div className="space-y-2">
                    {chapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter, index) => {
                        const chapterId = chapter.chapterId;
                        const chapterLessons = (lessonsByChapter[chapterId] || []).sort((a, b) => a.order - b.order);
                        const isExpanded = expandedChapters[chapterId];
                        
                        return (
                          <div key={chapterId} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {/* Chapter Header */}
                            <button
                              onClick={() => toggleChapter(chapterId)}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-primary font-bold">#{index + 1}</span>
                                <div className="text-left">
                                  <h3 className="font-semibold text-gray-900 dark:text-white">{chapter.title}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {chapterLessons.length} lessons
                                  </p>
                                </div>
                              </div>
                              <span className={`material-symbols-outlined text-gray-600 dark:text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                expand_more
                              </span>
                            </button>

                            {/* Chapter Lessons */}
                            {isExpanded && chapterLessons.length > 0 && (
                              <div className="bg-white dark:bg-gray-800">
                                {chapterLessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.lessonId}
                                    className="flex items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                                  >
                                    <span className="material-symbols-outlined text-primary text-sm">
                                      {lesson.contentType === 'video' ? 'play_circle' : 
                                       lesson.contentType === 'quiz' ? 'quiz' : 'article'}
                                    </span>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {lessonIndex + 1}. {lesson.title}
                                      </p>
                                      {lesson.durationMinutes && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {lesson.durationMinutes} min
                                        </p>
                                      )}
                                    </div>
                                    {!isAuthenticated && (
                                      <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Course content will be available soon.</p>
                  </div>
                )}
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
                  {/* Show subscription access badge for system courses */}
                  {course.isSystemCourse && course.price > 0 && hasActiveSubscription && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">verified</span>
                        <span className="font-semibold">Included in your subscription</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                        You have full access to this course
                      </p>
                    </div>
                  )}

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
                  ) : course.isSystemCourse && hasActiveSubscription ? (
                    <button
                      onClick={() => handleEnroll('purchase')}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      <span className="material-symbols-outlined">play_arrow</span>
                      Start Learning Now
                    </button>
                  ) : (
                    <>
                      {!isFree && (
                        <button
                          onClick={handleAddToCart}
                          disabled={isInCart(courseId)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition disabled:opacity-50"
                        >
                          {isInCart(courseId) ? (
                            <>
                              <span className="material-symbols-outlined">check</span>
                              Added to Cart
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined">add_shopping_cart</span>
                              Add to Cart
                            </>
                          )}
                        </button>
                      )}
                      
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
                        ) : isFree ? (
                          <>
                            <span className="material-symbols-outlined">check_circle</span>
                            Enroll For Free
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">payment</span>
                            Buy Now
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
