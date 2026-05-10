"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export function RightPanel() {
  return (
    <aside className="hidden lg:block w-80 h-screen sticky top-0 p-4 border-l border-border">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search Zooder..."
          className="w-full pl-10 pr-4 py-2 bg-muted rounded-full text-sm outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              window.location.href = `/explore?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
            }
          }}
        />
      </div>

      <div className="bg-muted rounded-xl p-4">
        <h3 className="font-semibold mb-3">Trending</h3>
        <div className="space-y-3">
          {["#NextJS", "#React", "#TailwindCSS", "#TypeScript", "#WebDev"].map(
            (tag) => (
              <Link
                key={tag}
                href={`/explore?q=${encodeURIComponent(tag)}`}
                className="block text-sm hover:bg-accent rounded p-1 -mx-1"
              >
                <p className="font-medium">{tag}</p>
                <p className="text-xs text-muted-foreground">Trending now</p>
              </Link>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
