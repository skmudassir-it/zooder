"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [form, setForm] = useState({ displayName: "", bio: "", website: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <h1 className="px-4 py-3 text-xl font-bold">Settings</h1>
      </div>

      <form onSubmit={handleSave} className="p-4 space-y-4">
        {saved && <div className="bg-primary/10 text-primary text-sm p-3 rounded-lg">Profile saved!</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
            maxLength={160}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </form>

      <div className="border-t border-border p-4 space-y-4">
        <h2 className="font-semibold">Account</h2>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full py-2 bg-destructive text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Sign Out
        </button>

        <button className="w-full py-2 border border-destructive text-destructive rounded-full font-semibold hover:bg-destructive/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
