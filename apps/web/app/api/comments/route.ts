import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCommentSchema = z.object({
  content: z.string().min(1).max(500),
  postId: z.string(),
  parentId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId: parsed.data.postId,
      parentId: parsed.data.parentId || null,
      authorId: userId,
    },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true } },
    },
  });

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId }, select: { authorId: true } });
  if (post && post.authorId !== userId) {
    await prisma.notification.create({
      data: { userId: post.authorId, type: "COMMENT", actorId: userId, postId: parsed.data.postId },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}
