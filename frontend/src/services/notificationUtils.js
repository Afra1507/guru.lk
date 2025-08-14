import { jwtDecode } from "jwt-decode";

/**
 * Notification-specific utility functions
 * (Separate from main authUtils to avoid conflicts)
 */

// Get token with notification-specific validation
export const getNotificationToken = () => {
  return localStorage.getItem("token");
};

// Get user ID specifically for notification service
export const getNotificationUserId = () => {
  try {
    const token = getNotificationToken();
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded?.notificationUserId || decoded?.id || decoded?.userId || decoded?.sub || null;
  } catch {
    return null;
  }
};

// Get user role specifically for notification permissions
export const getNotificationUserRole = () => {
  try {
    const token = getNotificationToken();
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded?.notificationRole || decoded?.role || null;
  } catch {
    return null;
  }
};