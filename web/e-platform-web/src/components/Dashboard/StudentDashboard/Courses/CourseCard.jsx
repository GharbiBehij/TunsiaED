// src/components/Course/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const progressPercent = course.progress || 0;
  const isCompleted = progressPercent === 100;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${course.image})` }}
      ></div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[#111418]">{course.title}</h3>
          <p className="text-sm text-[#617589]">By {course.instructor}</p>

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#617589]">Progress</span>
              <span
                className={`font-medium ${
                  isCompleted ? 'text-green-600' : 'text-[#111418]'
                }`}
              >
                {progressPercent}%
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/courses/${course.courseId || course.id}`}
            className={`w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold ${
              isCompleted
                ? 'bg-gray-100 text-[#111418] border border-gray-300'
                : 'bg-[#111418] text-white'
            }`}
          >
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
