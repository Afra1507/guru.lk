import React, { createContext, useContext, useState, useEffect } from "react";
import { getUnreadCount } from "../services/notificationService";
import { getNotificationUserId } from "../services/notificationUtils";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    const userId = getNotificationUserId();
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error("Notification Context Error:", error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, refreshCount: fetchUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
