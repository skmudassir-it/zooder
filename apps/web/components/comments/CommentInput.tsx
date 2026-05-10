"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommentInputProps {
  postId: string;
  onCommentAdded: (comment: any) => void;
}

export function CommentInput({ postId, onCommentAdded }: CommentInputProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), postId }),
      });
      if (res.ok) {
        const comment = await res.json();
        onCommentAdded(comment);
        setContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-b border-border">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Write a comment..."
        className="flex-1 bg-transparent outline-none text-sm"
        maxLength={500}
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || submitting}
        className="p-2 rounded-full hover:bg-accent text-primary disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
