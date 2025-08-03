import { contentAPI } from "../api/axiosInstances";

export const fetchApprovedLessons = () => contentAPI.get("/lessons/approved");

export const fetchLessonById = (id) => contentAPI.get(`/lessons/${id}`);

export const incrementLessonView = (id) =>
  contentAPI.post(`/lessons/${id}/view`);

export const approveLesson = (id) => contentAPI.post(`/lessons/${id}/approve`);

export const createDownload = (userId, lessonId) =>
  contentAPI.post("/downloads/create", null, {
    params: { userId, lessonId },
  });

export const getUserDownloads = (userId) =>
  contentAPI.get(`/downloads/user/${userId}`);

export const uploadLesson = (formData) =>
  contentAPI.post("/lessons/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchAllDownloads = () => contentAPI.get("/downloads/all");
