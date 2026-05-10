"use client";

import { useCallback } from "react";
import { useFeedStore } from "@/store/feedStore";

export function useFeed() {
  const { posts, cursor, hasMore, isLoading, setPosts, appendPosts, setLoading } = useFeedStore();

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?limit=20");
      const data = await res.json();
      setPosts(data.posts, data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [setPosts, setLoading]);

  const fetchMore = useCallback(async () => {
    if (!cursor || !hasMore || isLoading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?cursor=${cursor}&limit=20`);
      const data = await res.json();
      appendPosts(data.posts, data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, isLoading, appendPosts, setLoading]);

  return { posts, hasMore, isLoading, fetchInitial, fetchMore };
}
