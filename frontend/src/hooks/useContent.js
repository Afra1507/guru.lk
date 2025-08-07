import { useState, useCallback } from "react";
import contentService from "../services/contentService";
import { useAuth } from "../auth/useAuth";

export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleApiCall = useCallback(async (apiCall, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall(...args);
      if (process.env.NODE_ENV === "development") {
        console.log("API Data:", data);
      }
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      console.error("API Error:", err);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, []);

  /** -----------------------------------------
   * ✅ Admin-only Actions
   * ------------------------------------------ */
  const getAllLessons = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getAllLessonsAdmin);
  }, [user, handleApiCall]);

  const getPendingLessons = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getPendingLessons);
  }, [user, handleApiCall]);

  const approveLesson = useCallback(
    (id) => {
      if (!user || user.role.toLowerCase() !== "admin") {
        throw new Error("Admin privileges required");
      }
      return handleApiCall(contentService.approveLesson, id);
    },
    [user, handleApiCall]
  );

  const getContentAnalytics = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getContentAnalytics);
  }, [user, handleApiCall]);

  const getAllDownloads = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getAllDownloads);
  }, [user, handleApiCall]);

  /** -----------------------------------------
   * ✅ Contributor Features
   * ------------------------------------------ */
const fetchUserUploads = useCallback((userId) => {
  if (!user || user.role.toLowerCase() !== "contributor") {
    throw new Error("Contributor privileges required");
  }
  if (!userId) {
    throw new Error("User ID is undefined");
  }
  return handleApiCall(contentService.getLessonsByUploader, userId);
}, [user, handleApiCall]);

  const fetchUploadStats = useCallback(async () => {
    if (!user || user.role.toLowerCase() !== "contributor") {
      throw new Error("Contributor privileges required");
    }
    if (!user.id) {
      throw new Error("User ID is undefined");
    }
    const lessons = await handleApiCall(
      contentService.getLessonsByUploader,
      user.id
    );
    const approved = lessons.filter((l) => l.isApproved).length;
    const pending = lessons.length - approved;
    const downloads = lessons.reduce(
      (sum, l) => sum + (l.downloadCount || 0),
      0
    );

    return {
      totalUploads: lessons.length,
      approved,
      pending,
      downloads,
    };
  }, [user, handleApiCall]);

  /** -----------------------------------------
   * ✅ Shared (All Roles)
   * ------------------------------------------ */
  const createLesson = useCallback(
    (lessonData) => {
      return handleApiCall(contentService.createLesson, lessonData);
    },
    [handleApiCall]
  );

  const getApprovedLessons = useCallback(() => {
    return handleApiCall(contentService.getApprovedLessons);
  }, [handleApiCall]);

  const getLessonById = useCallback(
    (id) => {
      return handleApiCall(contentService.getLessonById, id);
    },
    [handleApiCall]
  );

  const incrementViewCount = useCallback(
    (id) => {
      return handleApiCall(contentService.incrementViewCount, id);
    },
    [handleApiCall]
  );

  const createDownload = useCallback(
    (lessonId) => {
      if (!user) throw new Error("Authentication required");
      return handleApiCall(contentService.createDownload, user.id, lessonId);
    },
    [user, handleApiCall]
  );

  const getUserDownloads = useCallback(() => {
    if (!user) throw new Error("Authentication required");
    return handleApiCall(contentService.getUserDownloads, user.id);
  }, [user, handleApiCall]);

  return {
    loading,
    error,

    // Shared
    createLesson,
    getApprovedLessons,
    getLessonById,
    incrementViewCount,
    createDownload,
    getUserDownloads,

    // Contributor
    fetchUserUploads,
    fetchUploadStats,

    // Admin
    getAllLessons,
    getPendingLessons,
    approveLesson,
    getContentAnalytics,
    getAllDownloads,
  };
};
