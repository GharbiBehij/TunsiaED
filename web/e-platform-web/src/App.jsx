import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider,useAuth } from './context/AuthContext';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard/StudentDashboard/StudentDashboard';
import Courses from './components/Courses/Course';
import Signup from './pages/Signup';


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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
