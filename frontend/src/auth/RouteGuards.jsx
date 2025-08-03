// auth/RouteGuards.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const RequireRole = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();
  return allowedRoles.includes(role) ? (
    children
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
