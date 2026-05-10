"use client";

import { useEffect, useCallback, useRef } from "react";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";
import { useFeed } from "@/hooks/useFeed";
import { useFeedStore } from "@/store/feedStore";

export function FeedList() {
  const { posts, hasMore, isLoading, fetchInitial, fetchMore } = useFeed();
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchInitial();
    }
  }, [fetchInitial]);

  const handleLike = useCallback(async (postId: string) => {
    toggleLike(postId);
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch {
      toggleLike(postId); // revert on error
    }
  }, [toggleLike]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 800 &&
        hasMore &&
        !isLoading
      ) {
        fetchMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, fetchMore]);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <h1 className="px-4 py-3 text-xl font-bold">Home</h1>
      </div>
      <PostComposer />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={handleLike} />
      ))}
      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-muted-foreground py-6 text-sm">You're all caught up!</p>
      )}
    </div>
  );
}
