import { contentAPI } from "../api/axiosInstances";

const contentService = {
  // Lesson endpoints
  createLesson: (lessonData) =>
    contentAPI.post("/lessons/create", lessonData).then((res) => res.data),

  getApprovedLessons: () =>
    contentAPI.get("/lessons/approved").then((res) => res.data),

  getLessonById: (id) =>
    contentAPI.get(`/lessons/${id}`).then((res) => res.data),

  approveLesson: (id) =>
    contentAPI.post(`/lessons/${id}/approve`).then((res) => res.data),

  incrementViewCount: (id) =>
    contentAPI.post(`/lessons/${id}/view`).then((res) => res.data),

  getPendingLessons: () =>
    contentAPI.get("/lessons/pending").then((res) => res.data),

  // Download endpoints
  createDownload: (userId, lessonId) =>
    contentAPI
      .post("/downloads/create", null, {
        params: { userId, lessonId },
      })
      .then((res) => res.data),

  getUserDownloads: (userId) =>
    contentAPI.get(`/downloads/user/${userId}`).then((res) => res.data),

  getAllDownloads: () =>
    contentAPI.get("/downloads/all").then((res) => res.data),
};

export default contentService;
