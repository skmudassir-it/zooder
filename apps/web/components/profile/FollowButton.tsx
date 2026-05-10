"use client";

import { useState } from "react";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing: initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
      const data = await res.json();
      setFollowing(data.following);
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors ${
        following
          ? "bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive border border-border"
          : "bg-primary text-primary-foreground hover:opacity-90"
      }`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
