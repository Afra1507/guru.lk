import axios from "axios";

const authBaseURL = process.env.REACT_APP_AUTH_BASE_URL || "http://localhost:8081";
const contentBaseURL = process.env.REACT_APP_CONTENT_BASE_URL || "http://localhost:8082";

// Create axios instance for auth API
export const API = axios.create({
  baseURL: authBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for content API
export const contentAPI = axios.create({
  baseURL: contentBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available (for API)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Attach token to every request if available (for contentAPI)
contentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: manual token setter (if you want to set token explicitly)
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    contentAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
    delete contentAPI.defaults.headers.common["Authorization"];
  }
};
