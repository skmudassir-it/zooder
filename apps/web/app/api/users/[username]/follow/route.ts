import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ username: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await props.params;
  const targetUser = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!targetUser) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const followingId = targetUser.id;
  const followerId = (session.user as any).id;

  if (followerId === followingId) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({ data: { followerId, followingId } });

  await prisma.notification.create({
    data: { userId: followingId, type: "FOLLOW", actorId: followerId },
  });

  return NextResponse.json({ following: true });
}
