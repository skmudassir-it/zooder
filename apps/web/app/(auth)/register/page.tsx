"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowLeft, Check, X } from "lucide-react";

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ displayName: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        if (typeof data.error === "object") {
          const errs: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.error)) {
            errs[key] = (msgs as string[])[0];
          }
          setFieldErrors(errs);
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
      }
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined as any });
    }
  };

  const passwordStrength = PASSWORD_RULES.filter((r) => r.test(form.password)).length;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-border/60 bg-card shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-3xl mb-4">🦓</Link>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-1.5">
              Join Zooder and start sharing
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-1.5 text-foreground">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="Your name"
                autoComplete="name"
                required
              />
              {fieldErrors.displayName && (
                <p className="text-destructive text-xs mt-1">{fieldErrors.displayName}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1.5 text-foreground">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="your_username"
                autoComplete="username"
                required
              />
              {fieldErrors.username && (
                <p className="text-destructive text-xs mt-1">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              {fieldErrors.email && (
                <p className="text-destructive text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-muted/60 border border-border/50 text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-destructive text-xs mt-1">{fieldErrors.password}</p>
              )}

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength
                            ? passwordStrength === 3
                              ? "bg-emerald-500"
                              : passwordStrength === 2
                              ? "bg-amber-500"
                              : "bg-destructive"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="space-y-0.5">
                    {PASSWORD_RULES.map((rule) => (
                      <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                        {rule.test(form.password) ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <X className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className={rule.test(form.password) ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                          {rule.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
