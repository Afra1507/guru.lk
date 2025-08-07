import { contentAPI } from "../api/axiosInstances";

const contentService = {
  // Lessons
  createLesson: (lessonData) =>
    contentAPI.post("/lessons/create", lessonData).then((res) => res.data),

  getLessonsByUploader: (uploaderId) =>
    contentAPI.get(`/lessons/uploader/${uploaderId}`).then((res) => res.data),

  getLessonsByUploaderAndApproval: (uploaderId, approved) =>
    contentAPI
      .get(`/lessons/uploader/${uploaderId}/status`, { params: { approved } })
      .then((res) => res.data),

  getApprovedLessons: () =>
    contentAPI.get("/lessons/approved").then((res) => res.data),

  getAllLessons: () => contentAPI.get("/lessons").then((res) => res.data),

  getLessonById: (id) =>
    contentAPI.get(`/lessons/${id}`).then((res) => res.data),

  approveLesson: (id) =>
    contentAPI.post(`/lessons/${id}/approve`).then((res) => res.data),

  incrementViewCount: (id) =>
    contentAPI.post(`/lessons/${id}/view`).then((res) => res.data),

  getPendingLessons: () =>
    contentAPI.get("/lessons/pending").then((res) => res.data),

  getPopularLessons: () =>
    contentAPI.get("/lessons/popular").then((res) => res.data),

  // Admin-specific
  getAllLessonsAdmin: () =>
    contentAPI.get("/lessons/all").then((res) => res.data),

  getContentAnalytics: () =>
    contentAPI.get("/lessons/analytics").then((res) => res.data),

  // Downloads
  // Changed createDownload to send payload in body, safer than query params
  createDownload: (userId, lessonId) =>
    contentAPI
      .post("/downloads/create", { userId, lessonId }) // payload in body
      .then((res) => res.data),

  getUserDownloads: (userId) =>
    contentAPI.get(`/downloads/user/${userId}`).then((res) => res.data),

  getAllDownloads: () =>
    contentAPI.get("/downloads/all").then((res) => res.data),
};

export default contentService;
