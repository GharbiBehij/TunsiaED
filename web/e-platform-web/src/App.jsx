// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import MainLayout from './Layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import Course from './pages/Course';
import CourseDetailPage from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import SubscriptionPage from './pages/SubscriptionPage';
import CartPage from './pages/CartPage';
import CreateCourse from './pages/Instructor/CreateCourse';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import PaymentPage from './pages/Payment/PaymentPage';
import PaymentResultPage from './pages/PaymentResultPage';
import Profile from './pages/Profile';

// Dashboards
import AdminDashboard from './pages/Admin/AdminDashboard';
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';

// Instructor Pending/Declined Status Page
import InstructorPendingPage from './pages/PendingInstructorPage';

// Route Protection Components
import ProtectedRoute from './components/shared/ProtectedRoute';
import CourseAccessRoute from './components/shared/CourseAccessRoute';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProtectedRoute roles={['student', 'instructor', 'admin']}><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Payment Routes */}
            <Route 
              path="/payment/:paymentId" 
              element={
                <ProtectedRoute roles={['student', 'instructor', 'admin']}>
                  <PaymentPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/payment/success" element={<PaymentResultPage status="success" />} />
            <Route path="/payment/cancel" element={<PaymentResultPage status="cancel" />} />

            {/* Course Content Routes */}
            <Route path="/courses/:courseId/learn" element={<CourseAccessRoute><CoursePlayer /></CourseAccessRoute>} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute roles={['student', 'instructor', 'admin']}><MainLayout /></ProtectedRoute>}>
              
              {/* Student Dashboard */}
              <Route path="/dashboard/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/pages/student/studentdashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />

              {/* Instructor Dashboard */}
              <Route path="/dashboard/instructor" element={<ProtectedRoute roles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
              <Route path="/pages/instructor/instructordashboard" element={<ProtectedRoute roles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
              <Route path="/instructor/new-course" element={<ProtectedRoute roles={['instructor']}><CreateCourse /></ProtectedRoute>} />

              {/* Instructor Pending / Declined */}
              <Route path="/instructor/status" element={<InstructorPendingPage />} />
              {/* Admin Dashboard */}
              <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/pages/admin/admindashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
