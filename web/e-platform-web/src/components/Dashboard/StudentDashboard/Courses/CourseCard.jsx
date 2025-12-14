// src/components/Course/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useChaptersByCourse, useLessonsByCourse } from '../../../../hooks';

export default function CourseCard({ course }) {
  const progressPercent = course.progress || 0;
  const isCompleted = progressPercent === 100;
  const { data: chapters = [] } = useChaptersByCourse(course.courseId || course.id);
  const { data: lessons = [] } = useLessonsByCourse(course.courseId || course.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div
        className="h-40 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-300"
        style={{ 
          backgroundImage: course.image 
            ? `url(${course.image})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Progress badge on image */}
        {progressPercent > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className={isCompleted ? 'text-green-600' : 'text-blue-600'}>
              {progressPercent}%
            </span>
            {isCompleted && <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[#111418] group-hover:text-primary transition line-clamp-2">{course.title}</h3>
          <p className="text-sm text-[#617589] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">person</span>
            {course.instructor}
          </p>

          {/* Course Content Stats */}
          {(chapters.length > 0 || lessons.length > 0) && (
            <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
              {chapters.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#617589]">
                  <span className="material-symbols-outlined text-sm text-primary">menu_book</span>
                  <span className="font-semibold">{chapters.length}</span>
                  <span>chapter{chapters.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {lessons.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#617589]">
                  <span className="material-symbols-outlined text-sm text-primary">play_circle</span>
                  <span className="font-semibold">{lessons.length}</span>
                  <span>lesson{lessons.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#617589] font-medium">Progress</span>
              <span
                className={`font-bold ${
                  isCompleted ? 'text-green-600' : 'text-[#111418]'
                }`}
              >
                {progressPercent}%
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-primary'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/courses/${course.courseId || course.id}`}
            className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all transform hover:scale-105 active:scale-95 ${
              isCompleted
                ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-300 hover:shadow-md'
                : progressPercent > 0
                ? 'bg-gradient-to-r from-blue-600 to-primary text-white hover:shadow-lg'
                : 'bg-gradient-to-r from-[#111418] to-gray-800 text-white hover:shadow-lg'
            }`}
          >
            {isCompleted && <span className="material-symbols-outlined text-lg">workspace_premium</span>}
            {progressPercent > 0 && !isCompleted && <span className="material-symbols-outlined text-lg">play_arrow</span>}
            {progressPercent === 0 && <span className="material-symbols-outlined text-lg">school</span>}
            {isCompleted
              ? 'View Certificate'
              : progressPercent > 0
              ? 'Continue Learning'
              : 'Start Course'}
          </Link>
        </div>
      </div>
    </div>
  );
}
