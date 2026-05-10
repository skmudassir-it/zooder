"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/utils";
import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";

const typeIcons = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  MENTION: AtSign,
};

const typeMessages = {
  LIKE: "liked your post",
  COMMENT: "commented on your post",
  FOLLOW: "followed you",
  MENTION: "mentioned you",
};

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
    markAsRead();
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <h1 className="px-4 py-3 text-xl font-bold">Notifications</h1>
      </div>
      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No notifications yet</p>
      ) : (
        <div>
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Heart;
            const message = typeMessages[notif.type] || "interacted";
            const href = notif.postId ? `/post/${notif.postId}` : `/profile/${notif.actor.username}`;
            return (
              <Link
                key={notif.id}
                href={href}
                className={`flex items-start gap-3 p-4 border-b border-border hover:bg-accent/30 transition-colors ${!notif.read ? "bg-accent/20" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">{notif.actor.displayName}</span>
                    <span className="text-muted-foreground text-sm">{message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{timeAgo(notif.createdAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
