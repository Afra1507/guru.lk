import axios from "axios";

const authBaseURL =
  process.env.REACT_APP_AUTH_BASE_URL || "http://localhost:8081";
const contentBaseURL =
  process.env.REACT_APP_CONTENT_BASE_URL || "http://localhost:8082";

// Create axios instance for auth API
export const API = axios.create({
  baseURL: authBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

// Create axios instance for content API
export const contentAPI = axios.create({
  baseURL: contentBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor for both API instances
const requestInterceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor to handle errors
const responseErrorInterceptor = (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized (token expired, invalid, etc.)
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login
  }
  return Promise.reject(error);
};

// Add interceptors to both API instances
[API, contentAPI].forEach((instance) => {
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(
    (response) => response,
    responseErrorInterceptor
  );
});

// Manual token setter
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    contentAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    delete contentAPI.defaults.headers.common["Authorization"];
  }
};
