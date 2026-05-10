import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "posts";

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  if (type === "users") {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { displayName: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        _count: { select: { followers: true } },
      },
    });
    return NextResponse.json({ results: users });
  }

  const posts = await prisma.post.findMany({
    where: { content: { contains: q, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json({ results: posts });
}
