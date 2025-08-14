// src/services/notificationHooks.js
import { useState, useEffect } from 'react';
import { getUnreadCount } from '../services/notificationService';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error refreshing notification count:", error);
    }
  };

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return { unreadCount, refreshCount };
};