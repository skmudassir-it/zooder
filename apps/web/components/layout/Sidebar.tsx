"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, Mail, User, Settings, PlusSquare } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-4 border-r border-border">
      <Link href="/feed" className="text-2xl font-bold text-primary mb-8">
        🦓 Zooder
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/feed?compose=true"
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-3 px-4 font-semibold hover:opacity-90 transition-opacity mb-4"
      >
        <PlusSquare className="w-5 h-5" />
        Post
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <ThemeToggle />
      </div>
    </aside>
  );
}
