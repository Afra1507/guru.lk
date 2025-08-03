import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";
import AdminDashboard from "../pages/AdminDashboard";
import ContributorDashboard from "../pages/ContributorDashboard";
import LearnerDashboard from "../pages/LearnerDashboard";
import Unauthorized from "../pages/Unauthorized";

import { RequireAuth, RequireRole } from "../utils/auth";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/contributor"
          element={
            <RequireRole allowedRoles={["CONTRIBUTOR"]}>
              <ContributorDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/learner"
          element={
            <RequireAuth>
              <LearnerDashboard />
            </RequireAuth>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Default route fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
