"use client";

import { useCallback } from "react";
import { useNotifStore } from "@/store/notifStore";

export function useNotifications() {
  const { notifications, unreadCount, setNotifications, markAllRead } = useNotifStore();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications, data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [setNotifications]);

  const markAsRead = useCallback(async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      markAllRead();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }, [markAllRead]);

  return { notifications, unreadCount, fetchNotifications, markAsRead };
}
