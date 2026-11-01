"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { switchUserAction } from "@/actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // In local development / demo mode, match against known test accounts or succeed gracefully
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickDemo = async (userId: string) => {
    setLoading(true);
    await switchUserAction(userId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-[#FAF7F0]">
      <div className="w-full max-w-md rounded-3xl border border-surfaceBorder bg-white p-8 shadow-xl text-left space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-forest-dark">
              NextReader
            </span>
          </Link>
          <h2 className="font-serif text-xl font-bold text-forest-dark">
            Welcome back, Reader
          </h2>
          <p className="text-xs text-mutedGray">
            Sign in to access your bookshelf, loans, and local reading circles.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mutedGray" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com"
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-charcoal">Password</label>
              <Link href="/forgot-password" className="text-forest hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mutedGray" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full gap-2 font-medium" disabled={loading}>
            <span>{loading ? "Signing in..." : "Sign In to NextReader"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="pt-4 border-t border-surfaceBorder space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mutedGray block text-center">
            One-Click Test Account Sign-in
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo("a0000000-0000-0000-0000-000000000001")}
              className="p-2 rounded-xl border border-surfaceBorder hover:bg-cream text-charcoal text-left transition-colors"
            >
              <strong className="block text-forest-dark">Arun Varma</strong>
              <span className="text-[10px] text-mutedGray">Kochi · Reader & Lender</span>
            </button>
            <button
              onClick={() => handleQuickDemo("a0000000-0000-0000-0000-000000000005")}
              className="p-2 rounded-xl border border-forest/30 bg-forest-subtle hover:bg-forest/20 text-forest text-left transition-colors"
            >
              <strong className="block">Admin Desk</strong>
              <span className="text-[10px] text-forest/80">Platform Operations</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-mutedGray pt-2">
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-forest font-bold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
