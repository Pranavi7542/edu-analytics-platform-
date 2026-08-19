import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

function ProtectedRoute({ user, allow, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute user={user} allow={["student"]}>
              <StudentDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute user={user} allow={["faculty", "admin"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? `/${user.role === "student" ? "student" : "faculty"}` : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
