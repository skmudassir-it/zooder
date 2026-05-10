import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/feed/PostCard";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      website: true,
      createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  if (!user) notFound();

  let isFollowing = false;
  if (session?.user) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: (session.user as any).id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return (
    <div>
      <ProfileHeader user={{ ...user, isFollowing, createdAt: user.createdAt.toISOString() }} />
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              createdAt: post.createdAt.toISOString(),
            }}
            onLike={async () => {}}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No posts yet</p>
        )}
      </div>
    </div>
  );
}
