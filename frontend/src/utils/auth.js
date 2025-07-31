import React from "react";
import { Navigate } from "react-router-dom";

export const isAuthenticated = () => !!localStorage.getItem("token");

export const getToken = () => localStorage.getItem("token");

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role?.toUpperCase() || "LEARNER";
};

// Route protection HOCs
export const withAuth = (Component) => {
  return (props) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return <Component {...props} />;
  };
};

export const withRole = (allowedRoles) => (Component) => {
  return (props) => {
    const role = getUserRole();
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Component {...props} />;
  };
};
