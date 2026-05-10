"use client";

import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    mediaUrls: string[];
    createdAt: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
    };
    _count: { likes: number; comments: number };
    liked?: boolean;
  };
  onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  return (
    <article className="p-4 border-b border-border hover:bg-accent/30 transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${post.author.username}`}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
            {post.author.avatarUrl ? (
              <img src={post.author.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              post.author.displayName[0].toUpperCase()
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <Link href={`/profile/${post.author.username}`} className="font-semibold text-sm hover:underline">
              {post.author.displayName}
            </Link>
            <span className="text-muted-foreground text-sm">@{post.author.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timeAgo(post.createdAt)}</span>
          </div>
          <Link href={`/post/${post.id}`}>
            <p className="mt-1 text-sm whitespace-pre-wrap break-words">{post.content}</p>
            {post.mediaUrls.length > 0 && (
              <div className={`mt-2 grid gap-1 rounded-xl overflow-hidden ${post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {post.mediaUrls.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-full h-48 object-cover" />
                ))}
              </div>
            )}
          </Link>
          <div className="flex items-center gap-4 mt-3">
            <Link href={`/post/${post.id}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
              <MessageCircle className="w-4 h-4 group-hover:text-primary" />
              <span className="text-xs">{post._count.comments}</span>
            </Link>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors">
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs">0</span>
            </button>
            <button
              onClick={() => onLike(post.id)}
              className={cn(
                "flex items-center gap-1 transition-colors",
                post.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", post.liked && "fill-current")} />
              <span className="text-xs">{post._count.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors ml-auto">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
