import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

// ======================
// Backend base URL (port 8081)
// ======================
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL || "http://localhost:8081";

// ======================
// LocalStorage Utilities
// ======================
export const isAuthenticated = () => !!localStorage.getItem("token");

export const getToken = () => localStorage.getItem("token");

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
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
  return user?.role?.toUpperCase() || "LEARNER"; // fallback default
};

// ======================
// Axios Global Config
// ======================
axios.defaults.baseURL = AUTH_BASE_URL;

const token = getToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ======================
// Route Guards (HOCs)
// ======================
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

// ======================
// Optional Token Validation
// ======================
export const validateToken = async () => {
  try {
    const res = await axios.get("/auth/validate-token");
    return res.status === 200;
  } catch (err) {
    clearAuth();
    return false;
  }
};
