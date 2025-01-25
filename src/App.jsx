import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SmoothScrollLayout from "./unit/components/smooth-scroll-layout";
import ParticlesBackground from "./ParticlesBackground";
import GetStarted from "./unit/pages/GetStarted";
import MoviesPage from "./unit/pages/MoviesPage";
import EmailVerificationPage from "./unit/pages/EmailVerificationPage";
import MovieDetailsPage from "./unit/pages/MovieDetailsPage";
import UserProfile from "./unit/pages/UserProfile";
import TopCharts from "./unit/pages/TopCharts";
import HomeNavBar from "./unit/components/HomeNavBar";
import { WebSocketProvider } from "./unit/hooks/websocket-context";
import NowPlaying from "./unit/pages/NowPlaying";
import { AuthProvider, useAuth } from "./unit/hooks/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/get-started" />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const fixedNavbarPaths = ["/movies", "/top-charts", "/now-playing"];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <WebSocketProvider>
      <ParticlesBackground />
      {isAuthenticated && fixedNavbarPaths.includes(location.pathname) && (
        <HomeNavBar />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<SmoothScrollLayout />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MoviesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/now-playing"
            element={
              <ProtectedRoute>
                <NowPlaying />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/:tmdbId"
            element={
              <ProtectedRoute>
                <MovieDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/top-charts"
            element={
              <ProtectedRoute>
                <TopCharts />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        </Routes>
      </div>
    </WebSocketProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;