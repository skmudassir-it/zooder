import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import { Heart, MessageCircle, Repeat2, Share, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      comments: {
        include: {
          author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) notFound();

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href="/feed" className="p-1 -ml-1 rounded-full hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </div>

      <article className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
              {post.author.avatarUrl ? (
                <img src={post.author.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                post.author.displayName[0].toUpperCase()
              )}
            </div>
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
              {post.author.displayName}
            </Link>
            <p className="text-muted-foreground text-sm">@{post.author.username}</p>
          </div>
        </div>
        <p className="mt-3 text-lg whitespace-pre-wrap">{post.content}</p>
        {post.mediaUrls.length > 0 && (
          <div className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {post.mediaUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="w-full max-h-96 object-cover" />
            ))}
          </div>
        )}
        <div className="mt-3 text-muted-foreground text-sm">
          {timeAgo(post.createdAt.toISOString())}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <span className="text-sm"><strong>{post._count.comments}</strong> <span className="text-muted-foreground">Comments</span></span>
          <span className="text-sm"><strong>{post._count.likes}</strong> <span className="text-muted-foreground">Likes</span></span>
        </div>

        <div className="flex items-center justify-around mt-2 pt-2 border-t border-border">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors p-2">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors p-2">
            <Repeat2 className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors p-2">
            <Heart className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors p-2">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </article>

      <div>
        <h3 className="px-4 py-3 text-sm font-semibold text-muted-foreground">
          {post._count.comments} {post._count.comments === 1 ? "Comment" : "Comments"}
        </h3>
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-4 border-b border-border">
            <Link href={`/profile/${comment.author.username}`}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0 text-xs">
                {comment.author.avatarUrl ? (
                  <img src={comment.author.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  comment.author.displayName[0].toUpperCase()
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Link href={`/profile/${comment.author.username}`} className="font-semibold text-sm hover:underline">
                  {comment.author.displayName}
                </Link>
                <span className="text-muted-foreground text-xs">@{comment.author.username}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-muted-foreground text-xs">{timeAgo(comment.createdAt.toISOString())}</span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                  {comment._count.likes > 0 && comment._count.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
