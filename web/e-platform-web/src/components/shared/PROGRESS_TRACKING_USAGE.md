# Progress Tracking System - Usage Guide

This document explains how to use the new progress tracking system for both students and instructors.

## Overview

The progress tracking system allows:
- **Students** to view their progress in enrolled courses
- **Instructors** to monitor the progress of all students enrolled in their courses
- Real-time progress updates
- Lesson completion tracking

## Architecture

### Backend Flow
```
Frontend → Service → BFF → Repository → DAO → Firestore
```

### Key Endpoints

#### Student Endpoints
- `GET /api/v1/student/progress` - Get student's overall progress
- `GET /api/v1/student/enrollments` - Get student's enrollments with progress
- `PATCH /api/v1/student/progress/:enrollmentId` - Update progress
- `POST /api/v1/student/progress/:enrollmentId/complete-lesson` - Mark lesson complete

#### Instructor Endpoints
- `GET /api/v1/instructor/courses/:courseId/students/progress` - Get all students' progress for a course

#### Enrollment Endpoints
- `GET /api/v1/enrollment/:enrollmentId/progress` - Get detailed enrollment progress
- `GET /api/v1/enrollment/course/:courseId/progress` - Get all enrollments with progress

## Frontend Usage

### For Students - View Your Progress

```jsx
import { useStudentProgress, useEnrollmentProgress, useCompleteLesson } from '../../hooks';
import { CoursePerformanceList } from '../../components/shared/CourseProgressCard';

function StudentDashboard() {
  // Get all student progress
  const { data: progressData, isLoading } = useStudentProgress();

  // Get specific enrollment progress
  const { data: enrollmentData } = useEnrollmentProgress('enrollment-id-123');

  // Mark a lesson as complete
  const completeLessonMutation = useCompleteLesson();

  const handleLessonComplete = (enrollmentId, lessonId) => {
    completeLessonMutation.mutate({ enrollmentId, lessonId });
  };

  return (
    <div>
      <h1>My Learning Progress</h1>
      
      {/* Display student's course progress */}
      <CoursePerformanceList
        courses={progressData || []}
        isLoading={isLoading}
        variant="student-progress"
        title="My Courses"
        role="student"
      />
    </div>
  );
}
```

### For Instructors - Monitor Student Progress

```jsx
import { useInstructorStudentProgress } from '../../hooks';
import { CoursePerformanceList } from '../../components/shared/CourseProgressCard';

function InstructorCoursePage({ courseId }) {
  // Get student progress for this course
  const { data, isLoading, error } = useInstructorStudentProgress(courseId);

  const studentProgress = data?.progress || [];

  return (
    <div>
      <h1>Student Progress</h1>
      
      {/* Display all students' progress in this course */}
      <CoursePerformanceList
        courses={studentProgress}
        isLoading={isLoading}
        variant="instructor-student-progress"
        title="Student Progress Tracking"
        role="instructor"
      />
      
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
}
```

### Update Student Progress

```jsx
import { useUpdateStudentProgress } from '../../hooks';

function LessonViewer({ enrollmentId, currentLesson }) {
  const updateProgressMutation = useUpdateStudentProgress();

  const handleProgressUpdate = (newProgress) => {
    updateProgressMutation.mutate({
      enrollmentId,
      progress: newProgress
    });
  };

  return (
    <div>
      <button onClick={() => handleProgressUpdate(75)}>
        Update to 75%
      </button>
    </div>
  );
}
```

## CourseProgressCard Component Variants

### 1. List Variant (Default)
Simple list view with progress bar
```jsx
<CourseProgressCard 
  course={course} 
  variant="list" 
/>
```

### 2. Card Variant
For admin/instructor dashboards showing enrollment stats
```jsx
<CourseProgressCard 
  course={course} 
  variant="card" 
/>
```

### 3. Student Progress Variant
For students viewing their enrolled courses
```jsx
<CourseProgressCard 
  course={{
    title: "React Fundamentals",
    progress: 65,
    completedLessons: [1, 2, 3],
    totalLessons: 10,
    enrolledAt: "2025-01-15",
    completed: false
  }} 
  variant="student-progress"
  role="student"
/>
```

### 4. Instructor Student Progress Variant
For instructors monitoring individual student progress
```jsx
<CourseProgressCard 
  course={{
    studentName: "John Doe",
    studentEmail: "john@example.com",
    progress: 80,
    enrolledAt: "2025-01-10",
    completed: false
  }} 
  variant="instructor-student-progress"
  role="instructor"
/>
```

## Data Structure

### Enrollment Document in Firestore
```javascript
{
  enrollmentId: "abc123",
  userId: "student-uid",
  courseId: "course-123",
  status: "active",
  progress: 65, // 0-100
  completedLessons: ["lesson1", "lesson2", "lesson3"],
  completed: false,
  enrolledAt: Timestamp,
  updatedAt: Timestamp,
  paymentId: "payment-123"
}
```

## Permissions

### Student Permissions
- Can view their own progress
- Can update their own progress
- Can mark lessons as complete

### Instructor Permissions
- Can view progress of all students in their courses
- Cannot modify student progress directly

### Admin Permissions
- Full access to all progress data
- Can view and modify any progress

## Best Practices

1. **Stale Time Configuration**
   - Student progress: 1 minute (frequently updated)
   - Instructor view: 1 minute (monitor in real-time)
   - Enrollment details: 30 seconds (active learning)

2. **Progress Calculation**
   - Progress is automatically calculated based on completed lessons
   - Formula: `(completedLessons / totalLessons) * 100`

3. **Automatic Completion**
   - When progress reaches 100%, the enrollment is automatically marked as complete
   - Triggers certificate generation (if implemented)

4. **Error Handling**
   - Always check for errors in hooks
   - Show user-friendly error messages
   - Handle unauthorized access gracefully

## Examples by Role

### Student Dashboard
```jsx
import { useStudentCourses, CoursePerformanceList } from '@/hooks';

function StudentDashboard() {
  const { data: courses, isLoading } = useStudentCourses();

  return (
    <CoursePerformanceList
      courses={courses}
      isLoading={isLoading}
      variant="student-progress"
      title="My Learning Journey"
      viewAllLink="/student/courses"
    />
  );
}
```

### Instructor Course Management
```jsx
import { useInstructorStudentProgress } from '@/hooks';

function CourseStudentsPage({ courseId }) {
  const { data, isLoading } = useInstructorStudentProgress(courseId);

  return (
    <div>
      <h2>Student Progress Overview</h2>
      <CoursePerformanceList
        courses={data?.progress || []}
        isLoading={isLoading}
        variant="instructor-student-progress"
        title={`Students: ${data?.progress?.length || 0}`}
      />
    </div>
  );
}
```

## Testing

To test the system:

1. **As a Student:**
   - Enroll in a course
   - Complete lessons
   - Check progress updates in real-time

2. **As an Instructor:**
   - Navigate to your course
   - View the student progress page
   - Monitor multiple students' progress

3. **Verify:**
   - Progress bars update correctly
   - Completion badges appear at 100%
   - Data refreshes according to stale time
   - Unauthorized access is blocked

## Troubleshooting

### Progress not updating?
- Check if the enrollment exists
- Verify the user has the correct role
- Check browser console for errors
- Ensure the backend API is responding

### Unauthorized errors?
- Verify user authentication
- Check role permissions in SharedPermission.js
- Ensure courseId belongs to the instructor

### Data not showing?
- Check if courses have enrollments
- Verify Firestore data structure
- Check if progress field exists in documents
