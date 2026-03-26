import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import CustomCursor from './components/CustomCursor';
import ChatBot from './components/ChatBot';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LibraryPage from './pages/LibraryPage';
import BookingPage from './pages/BookingPage';
import SessionsPage from './pages/SessionsPage';
import HonorBoard from './pages/HonorBoard';
import CertificatesPage from './pages/CertificatesPage';
import AdminCertificatesPage from './pages/AdminCertificatesPage';
import ChatRoomsPage from './pages/ChatRoomsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate home
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'mentor') return <Navigate to="/mentor" replace />;
    return <Navigate to="/student" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public — always accessible */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={
        currentUser
          ? <Navigate to={currentUser.role === 'admin' ? '/admin' : currentUser.role === 'mentor' ? '/mentor' : '/student'} replace />
          : <AuthPage />
      } />

      {/* Student routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/booking" element={
        <ProtectedRoute allowedRoles={['student']}>
          <BookingPage />
        </ProtectedRoute>
      } />

      {/* Mentor routes */}
      <Route path="/mentor" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <MentorDashboard />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-certificates" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminCertificatesPage />
        </ProtectedRoute>
      } />

      {/* Shared routes — library & honor board are public (guest access) */}
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/honor-board" element={<HonorBoard />} />
      <Route path="/sessions" element={
        <ProtectedRoute>
          <SessionsPage />
        </ProtectedRoute>
      } />
      <Route path="/certificates" element={
        <ProtectedRoute>
          <CertificatesPage />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatRoomsPage />
        </ProtectedRoute>
      } />

      {/* Profile */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          {/* Global UI — cursor + chatbot appear on every page */}
          <CustomCursor />
          <ChatBot />
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}
