// src/pages/CoursePlayer.jsx - Course learning interface
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseById, useChaptersByCourse, useLessonsByCourse } from '../hooks';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const { data: course, isLoading, isError } = useCourseById(courseId);
  const { data: chapters = [], isLoading: chaptersLoading } = useChaptersByCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessonsByCourse(courseId);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
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

  if (isLoading || chaptersLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-text-light/70 dark:text-text-dark/70">Loading course...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500 text-center">Failed to load course. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to={`/courses/${courseId}`}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Course Details
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            {course.title}
          </h1>
          <p className="text-text-light/70 dark:text-text-dark/70">
            {course.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-background-dark rounded-lg border border-neutral-light/20 dark:border-neutral-dark/20 p-6">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                Course Content
              </h2>
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-neutral-light/10 dark:hover:bg-neutral-dark/10 transition-colors"
                    >
                      <span className="font-medium text-text-light dark:text-text-dark">
                        {chapter.title}
                      </span>
                      <span className="material-symbols-outlined text-base">
                        {expandedChapters[chapter.id] ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {expandedChapters[chapter.id] && (
                      <div className="ml-4 space-y-1">
                        {lessonsByChapter[chapter.id]?.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left p-2 rounded-lg transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-neutral-light/10 dark:hover:bg-neutral-dark/10 text-text-light/70 dark:text-text-dark/70'
                            }`}
                          >
                            {lesson.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <div className="bg-white dark:bg-background-dark rounded-lg border border-neutral-light/20 dark:border-neutral-dark/20 p-6">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                  {selectedLesson.title}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-text-light/70 dark:text-text-dark/70 mb-4">
                    {selectedLesson.description}
                  </p>
                  <div className="whitespace-pre-wrap text-text-light dark:text-text-dark">
                    {selectedLesson.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-background-dark rounded-lg border border-neutral-light/20 dark:border-neutral-dark/20 p-6">
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-neutral-light/30 dark:text-neutral-dark/30 mb-4">
                    play_circle
                  </span>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                    Select a Lesson
                  </h3>
                  <p className="text-text-light/70 dark:text-text-dark/70">
                    Choose a lesson from the sidebar to start learning.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}