"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; displayName: string; avatarUrl: string | null };
  _count: { likes: number };
  liked?: boolean;
}

interface CommentThreadProps {
  comments: Comment[];
  onLike: (commentId: string) => void;
}

export function CommentThread({ comments, onLike }: CommentThreadProps) {
  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 p-4 border-b border-border">
          <Link href={`/profile/${comment.author.username}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0 text-xs">
              {comment.author.avatarUrl ? (
                <img src={comment.author.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                comment.author.displayName[0].toUpperCase()
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Link href={`/profile/${comment.author.username}`} className="font-semibold text-sm hover:underline">
                {comment.author.displayName}
              </Link>
              <span className="text-muted-foreground text-xs">@{comment.author.username}</span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-muted-foreground text-xs">{timeAgo(comment.createdAt)}</span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 mt-2 text-xs transition-colors ${comment.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.liked ? "fill-current" : ""}`} />
              {comment._count.likes > 0 && comment._count.likes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
