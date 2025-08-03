import { API } from "../api/axiosInstances";

// Register user (no token needed)
export const registerUser = async (data) => {
  const payload = {
    ...data,
    role: data.role.toUpperCase(),
    preferredLanguage: data.preferredLanguage.toUpperCase(),
  };
  const response = await API.post("/auth/register", payload);
  return response.data;
};

// Login user (no token needed)
export const loginUser = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };
  const response = await API.post("/auth/login", payload);
  return response.data;
};

// Validate token (no token needed)
export const validateToken = async (token) => {
  const response = await API.post("/auth/validate-token", { token });
  return response.data;
};

// Fetch user profile (token auto-attached)
export const fetchUserProfile = async () => {
  const response = await API.get("/user/profile");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (data) => {
  const response = await API.put("/user/profile", data);
  return response.data;
};
