import { create } from "zustand";

interface Notification {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "MENTION";
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  postId: string | null;
  read: boolean;
  createdAt: string;
}

interface NotifState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[], unreadCount: number) => void;
  addNotification: (notification: Notification) => void;
  markAllRead: () => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications, unreadCount) => set({ notifications, unreadCount }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
