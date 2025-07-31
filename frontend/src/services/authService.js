import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (data) => {
  const payload = {
    ...data,
    role: data.role.toUpperCase(), // convert to LEARNER / CONTRIBUTOR
    preferredLanguage: data.preferredLanguage.toUpperCase(), // SINHALA / TAMIL
  };
  const response = await API.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };
  const response = await API.post("/auth/login", payload);
  return response.data;
};

export const validateToken = async (token) => {
  const response = await API.post("/auth/validate-token", { token });
  return response.data;
};

export const fetchUserProfile = async (token) => {
  const response = await API.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
// export const updateUserProfile = async (token, data) => {
//   const response = await API.put('/user/profile', data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };
