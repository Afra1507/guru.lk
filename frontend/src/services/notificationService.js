import { notificationAPI } from "../api/axiosInstances";

// Get all notifications for user
export const getMyNotifications = async () => {
  const response = await notificationAPI.get(`/notifications`);
  return response.data;
};

// Get paginated notifications
export const getNotificationsPaginated = async (pageable) => {
  const response = await notificationAPI.get(`/notifications/paginated`, {
    params: pageable,
  });
  return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async () => {
  const response = await notificationAPI.get(`/notifications/unread`);
  return response.data;
};

// Get unread count
export const getUnreadCount = async () => {
  const response = await notificationAPI.get(`/notifications/unread/count`);
  return response.data;
};

// Get recent notifications
export const getRecentNotifications = async (count = 5) => {
  const response = await notificationAPI.get(`/notifications/recent`, {
    params: { count },
  });
  return response.data;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const response = await notificationAPI.patch(
    `/notifications/${notificationId}/read`
  );
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await notificationAPI.patch(`/notifications/read-all`);
  return response.data;
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  await notificationAPI.delete(`/notifications/${notificationId}`);
};

// Send notification to a specific user
export const sendNotificationToUser = async (request) => {
  const response = await notificationAPI.post("/notifications", request);
  return response.data;
};

// Send notification to a role (Admin only)
export const sendNotificationToRole = async (request) => {
  const response = await notificationAPI.post("/notifications/role", request);
  return response.data;
};

// Broadcast notification to all users (Admin only)
export const sendNotificationToAll = async (request) => {
  const response = await notificationAPI.post(
    "/notifications/broadcast",
    request
  );
  return response.data;
};