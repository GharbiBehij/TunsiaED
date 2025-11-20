import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import HomePage from './components/home/HomePage/HomePage';
import Dashboard from './components/Dashboard/StudentDashboard/StudentDashboard';
import Courses from './components/Courses/Course'
import Signup from './components/SignUp/Signup';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
//useAuth custom hook 
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup/>}/>
          <Route
            path="/StudentDashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
    </AuthProvider>
  );
}

export default App;
