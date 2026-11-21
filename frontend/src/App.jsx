import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ServiceDashboard } from './pages/ServiceDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { NewComplaintPage } from './pages/NewComplaintPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { WastePickupPage } from './pages/WastePickupPage';
import { ReuseMarketplacePage } from './pages/ReuseMarketplacePage';
import { RecyclingCentresPage } from './pages/RecyclingCentresPage';
import { WasteEducationPage } from './pages/WasteEducationPage';
import { SmartAssistantPage } from './pages/SmartAssistantPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="/pickup" element={<WastePickupPage />} />
          <Route path="/reuse" element={<ReuseMarketplacePage />} />
          <Route path="/recycling" element={<RecyclingCentresPage />} />
          <Route path="/education" element={<WasteEducationPage />} />
          <Route path="/assistant" element={<SmartAssistantPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Citizen Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <ProtectedRoute>
                <NewComplaintPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Service Team Protected */}
          <Route
            path="/service"
            element={
              <RoleRoute allowedRoles={['service_team', 'admin']}>
                <ServiceDashboard />
              </RoleRoute>
            }
          />

          {/* Admin Protected */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
