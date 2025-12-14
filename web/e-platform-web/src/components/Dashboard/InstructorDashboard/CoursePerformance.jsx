import React from 'react';
import { CoursePerformanceList } from '../../shared/CourseProgressCard';

export default function CoursePerformance({ data: courses, isLoading }) {

  return (
    <CoursePerformanceList
      courses={courses}
      isLoading={isLoading}
      variant="card"
      viewAllLink="/dashboard/courses"
    />
  );
}