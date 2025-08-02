import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import AdminDashboard from "../pages/AdminDashboard";
import ContributorDashboard from "../pages/ContributorDashboard";
import LearnerDashboard from "../pages/LearnerDashboard";
import Unauthorized from "../pages/Unauthorized";
import { withAuth, withRole } from "../utils/auth";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/admin" element={withRole(["ADMIN"])(AdminDashboard)} />
        <Route
          path="/contributor"
          element={withRole(["CONTRIBUTOR"])(ContributorDashboard)}
        />
        <Route path="/learner" element={withAuth(LearnerDashboard)} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Default route can redirect or show landing */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
