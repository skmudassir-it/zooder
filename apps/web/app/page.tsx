import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Zap, Palette, Shield, Users, Image } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/feed");

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <span className="text-xl font-bold text-primary">🦓 Zooder</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          Now with real-time updates
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Share what's{" "}
          <span className="text-primary">happening</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Zooder is the modern social platform for real-time conversations. 
          Post updates, share media, and connect with your community — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-muted text-foreground rounded-full font-semibold text-lg hover:bg-accent transition-all"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything you need in one platform
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: MessageCircle,
              title: "Real-time Posts",
              desc: "Post updates and see reactions instantly with WebSocket-powered live feeds. No refreshing needed.",
            },
            {
              icon: Image,
              title: "Media Sharing",
              desc: "Upload images directly in your posts. Drag-and-drop support with automatic optimization.",
            },
            {
              icon: Palette,
              title: "Light & Dark Themes",
              desc: "Choose between light, dark, or system-auto theme. Your eyes will thank you.",
            },
            {
              icon: Users,
              title: "Follow System",
              desc: "Build your network. Follow people you're interested in and curate your personal feed.",
            },
            {
              icon: Shield,
              title: "Secure Auth",
              desc: "Enterprise-grade JWT authentication with HttpOnly cookies. Your data stays safe.",
            },
            {
              icon: Zap,
              title: "Instant Notifications",
              desc: "Get real-time notifications for likes, comments, follows, and mentions — delivered instantly.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-accent/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to join the conversation?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Create your account in seconds. It's free.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
          >
            Get Started → 
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© 2026 Zooder. Built with Next.js & Coolify.</span>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
