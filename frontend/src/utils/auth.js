// utils/auth.js
import axios from "axios";

export const AUTH_BASE_URL =
  process.env.REACT_APP_AUTH_BASE_URL || "http://localhost:8081";

// ===================
// LocalStorage helpers
// ===================
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
export const setCurrentUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};
export const getUserRole = () =>
  getCurrentUser()?.role?.toUpperCase() || "LEARNER";
