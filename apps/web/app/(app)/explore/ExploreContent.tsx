"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";

interface PostResult {
  id: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  author: { id: string; username: string; displayName: string; avatarUrl: string | null };
  _count: { likes: number; comments: number };
  liked?: boolean;
}

interface UserResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  _count: { followers: number };
}

type Result = PostResult | UserResult;

export function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Result[]>([]);
  const [type, setType] = useState<"posts" | "users">("posts");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQ) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(initialQ)}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results || []))
      .finally(() => setLoading(false));
  }, [initialQ, type]);

  const handleSearch = () => {
    if (!query.trim()) return;
    window.history.pushState({}, "", `/explore?q=${encodeURIComponent(query.trim())}`);
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query.trim())}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results || []))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <h1 className="px-4 py-3 text-xl font-bold">Explore</h1>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search posts and users..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setType("posts")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${type === "posts" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Posts
            </button>
            <button
              onClick={() => setType("users")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${type === "users" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Users
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {initialQ ? "No results found" : "Search for posts and users"}
        </p>
      ) : (
        <div>
          {results.map((item) => (
            <div key={item.id} className="border-b border-border">
              {type === "posts" ? (
                <PostCard
                  post={item as PostResult}
                  onLike={async (id) => {
                    await fetch(`/api/posts/${id}/like`, { method: "POST" });
                  }}
                />
              ) : (
                <a href={`/profile/${(item as UserResult).username}`} className="flex items-center gap-3 p-4 hover:bg-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {(item as UserResult).displayName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{(item as UserResult).displayName}</p>
                    <p className="text-muted-foreground text-sm">@{(item as UserResult).username}</p>
                    <p className="text-xs text-muted-foreground">{(item as UserResult).bio}</p>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
