import axios from "axios";

export const fetchAllUsers = () => axios.get("/user/admin/all");

export const fetchUserById = (userId) => axios.get(`/user/admin/${userId}`);

export const updateUserRole = (userId, role) =>
  axios.put(`/user/admin/${userId}/role?role=${role}`);

export const deleteUser = (userId) => axios.delete(`/user/admin/${userId}`);
