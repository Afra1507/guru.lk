import { API } from "../api/axiosInstances";

export const fetchAllUsers = async () => {
  const response = await API.get("/user/admin/all");
  return response.data;
};

export const fetchUserById = async (userId) => {
  const response = await API.get(`/user/admin/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await API.put(`/user/admin/${userId}/role`, null, {
    params: { role },
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await API.delete(`/user/admin/${userId}`);
  return response.data;
};
