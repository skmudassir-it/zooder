import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-primary mb-4">🦓 Zooder</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Share what&apos;s happening. Join the conversation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-muted text-foreground rounded-full font-semibold hover:bg-accent transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
