"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Mail, Lock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Kochi");
  const [locality, setLocality] = useState("Kakkanad");
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-[#FAF7F0]">
      <div className="w-full max-w-lg rounded-3xl border border-surfaceBorder bg-white p-8 shadow-xl text-left space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-forest-dark">
              NextReader
            </span>
          </Link>
          <h2 className="font-serif text-xl font-bold text-forest-dark">
            Create Your Reader Account
          </h2>
          <p className="text-xs text-mutedGray">
            Join thousands of neighbours discovering and circulating physical books.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal">Full Name *</label>
              <Input
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Diya Menon"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal">Username *</label>
              <Input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. diya_reads"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Email Address *</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@example.com"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Password *</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal">City *</label>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kochi"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal">Locality / Neighbourhood *</label>
              <Input
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Kakkanad"
                className="text-xs"
              />
            </div>
          </div>

          <p className="text-[11px] text-mutedGray">
            By creating an account, you agree to the NextReader Lending Code and Privacy Policy. Exact addresses remain strictly private.
          </p>

          <Button type="submit" variant="primary" className="w-full gap-2 font-medium" disabled={loading}>
            <span>{loading ? "Creating Account..." : "Join Community"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-mutedGray pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-forest font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

