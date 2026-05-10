"use client";

import { useState, useRef } from "react";
import { Image, Send, Smile, X } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";

export function PostComposer() {
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPost = useFeedStore((s) => s.addPost);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), mediaUrls }),
      });
      if (res.ok) {
        const post = await res.json();
        addPost(post);
        setContent("");
        setMediaUrls([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setMediaUrls([...mediaUrls, data.url]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="p-4 border-b border-border">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg min-h-[80px]"
        maxLength={500}
      />
      {mediaUrls.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {mediaUrls.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
              <button
                onClick={() => setMediaUrls(mediaUrls.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full hover:bg-accent text-primary transition-colors"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button className="p-2 rounded-full hover:bg-accent text-primary transition-colors">
            <Smile className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${content.length > 450 ? "text-destructive" : "text-muted-foreground"}`}>
            {content.length}/500
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
