import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ username: string }> }
) {
  const { username } = await props.params;
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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const session = await auth();
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

  return NextResponse.json({ ...user, posts, isFollowing });
}
