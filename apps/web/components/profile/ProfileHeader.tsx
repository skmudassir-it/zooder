"use client";

import { FollowButton } from "./FollowButton";

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    website: string | null;
    createdAt: string;
    isFollowing: boolean;
    _count: { posts: number; followers: number; following: number };
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-10 mb-3">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center text-primary font-bold text-2xl">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              user.displayName[0].toUpperCase()
            )}
          </div>
          <FollowButton userId={user.id} isFollowing={user.isFollowing} />
        </div>
        <h1 className="text-xl font-bold">{user.displayName}</h1>
        <p className="text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
        {user.website && (
          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline mt-1 block">
            {user.website}
          </a>
        )}
        <div className="flex gap-4 mt-3 text-sm">
          <span><strong>{user._count.following}</strong> <span className="text-muted-foreground">Following</span></span>
          <span><strong>{user._count.followers}</strong> <span className="text-muted-foreground">Followers</span></span>
        </div>
      </div>
    </div>
  );
}
