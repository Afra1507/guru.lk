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

  const createLesson = useCallback(
    (lessonData) => handleApiCall(contentService.createLesson, lessonData),
    [handleApiCall]
  );

  const getApprovedLessons = useCallback(
    () => handleApiCall(contentService.getApprovedLessons),
    [handleApiCall]
  );

  const getAllLessons = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getAllLessonsAdmin); // Updated to admin version
  }, [user, handleApiCall]);

  const getContentAnalytics = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getContentAnalytics);
  }, [user, handleApiCall]);

  const getLessonById = useCallback(
    (id) => handleApiCall(contentService.getLessonById, id),
    [handleApiCall]
  );

  const approveLesson = useCallback(
    (id) => {
      if (!user || user.role.toLowerCase() !== "admin") {
        throw new Error("Admin privileges required");
      }
      return handleApiCall(contentService.approveLesson, id);
    },
    [user, handleApiCall]
  );

  const incrementViewCount = useCallback(
    (id) => handleApiCall(contentService.incrementViewCount, id),
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

  const getPendingLessons = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getPendingLessons);
  }, [user, handleApiCall]);

  const getAllDownloads = useCallback(() => {
    if (!user || user.role.toLowerCase() !== "admin") {
      throw new Error("Admin privileges required");
    }
    return handleApiCall(contentService.getAllDownloads);
  }, [user, handleApiCall]);

  return {
    loading,
    error,
    createLesson,
    getApprovedLessons,
    getAllLessons,
    getContentAnalytics,
    getLessonById,
    approveLesson,
    incrementViewCount,
    createDownload,
    getUserDownloads,
    getPendingLessons,
    getAllDownloads,
  };
};
