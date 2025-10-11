// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingDashboard from "./pages/LandingDasboard";
import Login from "./pages/Login";
import StudentPage from "./components/StudentPage";
import LecturerPage from "./components/LecturerPage";
import PrincipalLecturer from "./components/PrincipalLecturer";
import ProgramLeader from "./components/ProgramLeader";
import AdminPage from "./components/AdminPage";
import ClassesList from "./components/ClassesList";
import ClassDetail from "./components/ClassDetail";

// Layout wrapper component to handle navbar visibility
function AppLayout({ children, user, logout }) {
  const location = useLocation();
  
  // Don't show navbar on landing page or login page
  const hideNavbar = location.pathname === "/" || location.pathname === "/login";
  
  return (
    <>
      {!hideNavbar && user && <Navbar setUser={logout} />}
      {children}
    </>
  );
}

export default function App() {
  // ==================== USER STATE ====================
  const [user, setUser] = useState(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (!rawUser || !token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      }
      return { ...JSON.parse(rawUser), token };
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  useEffect(() => {
    // Clear any invalid state
    if (!user) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const logout = () => {
    // Clear all auth-related data
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  // ==================== PROTECTED ROUTE ====================
  function ProtectedRoute({ user, allowedRoles, children }) {
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
  }

  return (
    <Router>
      <AppLayout user={user} logout={logout}>
        <Routes>
          {/* Landing Dashboard - Default Route */}
          <Route path="/" element={<LandingDashboard />} />
          
          {/* Login Route */}
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute user={user} allowedRoles={["student"]}>
                <StudentPage user={user} />
              </ProtectedRoute>
            }
          />

          {/* Lecturer Routes */}
          <Route
            path="/lecturer"
            element={
              <ProtectedRoute user={user} allowedRoles={["lecturer"]}>
                <LecturerPage user={user} />
              </ProtectedRoute>
            }
          />

          {/* Principal Lecturer Routes */}
          <Route
            path="/prl"
            element={
              <ProtectedRoute user={user} allowedRoles={["prl"]}>
                <PrincipalLecturer user={user} />
              </ProtectedRoute>
            }
          />

          {/* Program Leader Routes */}
          <Route
            path="/pl"
            element={
              <ProtectedRoute user={user} allowedRoles={["pl"]}>
                <ProgramLeader user={user} />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminPage user={user} />
              </ProtectedRoute>
            }
          />

          {/* Classes Routes */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute user={user} allowedRoles={["lecturer", "prl", "pl"]}>
                <ClassesList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/classes/:moduleId"
            element={
              <ProtectedRoute user={user} allowedRoles={["lecturer", "prl", "pl"]}>
                <ClassDetail user={user} />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
