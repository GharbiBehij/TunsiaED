// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './Layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import Course from './pages/Course';
import CourseDetailPage from './pages/CourseDetail';
import SubscriptionPage from './pages/SubscriptionPage';
import CreateCourse from './pages/Instructor/CreateCourse';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dashboards
import AdminDashboard from './pages/Admin/AdminDashboard';
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';

// Route Protection Components
import ProtectedRoute from './components/shared/ProtectedRoute'; // Requires authentication + specific roles
import SubscriptionProtectedRoute from './components/shared/SubscriptionProtectedRoute'; // Requires active subscription
import CourseAccessRoute from './components/shared/CourseAccessRoute'; // Grants access based on enrollment, subscription, or free course

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/course" element={<Course />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Course Content Routes - Protected by enrollment OR subscription */}
          { /*<Route path="/courses/:courseId/learn" element={<CourseAccessRoute><CoursePlayer /></CourseAccessRoute>} />}
          {<Route path="/courses/:courseId/lessons/:lessonId" element={<CourseAccessRoute><LessonView /></CourseAccessRoute>} />}

          {/* Subscription Protected Routes - Premium content requiring active subscription */}
          {/* Example premium routes - uncomment and add premium pages as needed */}
          { /*<Route path="/premium/resources" element={<SubscriptionProtectedRoute><PremiumResources /></SubscriptionProtectedRoute>} /> }
          { <Route path="/premium/masterclasses" element={<SubscriptionProtectedRoute><Masterclasses /></SubscriptionProtectedRoute>} />}
          { <Route path="/premium/community" element={<SubscriptionProtectedRoute><PremiumCommunity /></SubscriptionProtectedRoute>} />}

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute roles={['student', 'instructor', 'admin']}><MainLayout /></ProtectedRoute>}>

            {/* Student Dashboard */}
            <Route 
              path="/pages/student/studentdashboard" 
              element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} 
            />

            {/* Instructor Dashboard */}
            <Route 
              path="/pages/instructor/instructordashboard" 
              element={<ProtectedRoute roles={['instructor']}><InstructorDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/instructor/new-course" 
              element={<ProtectedRoute roles={['instructor']}><CreateCourse /></ProtectedRoute>} 
            />

            {/* Admin Dashboard */}
            <Route 
              path="/pages/admin/admindashboard" 
              element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
