"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useFeedStore } from "@/store/feedStore";
import { useNotifStore } from "@/store/notifStore";

export function useSocket() {
  const initialized = useRef(false);
  const addPost = useFeedStore((s) => s.addPost);
  const addNotification = useNotifStore((s) => s.addNotification);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const socket = getSocket();
    socket.connect();

    socket.on("feed:new_post", (post: any) => {
      addPost(post);
    });

    socket.on("notification:new", (notification: any) => {
      addNotification(notification);
    });

    return () => {
      socket.disconnect();
      initialized.current = false;
    };
  }, [addPost, addNotification]);
}
