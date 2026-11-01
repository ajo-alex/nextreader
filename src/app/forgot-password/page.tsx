"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-[#FAF7F0]">
      <div className="w-full max-w-md rounded-3xl border border-surfaceBorder bg-white p-8 shadow-xl text-left space-y-6">
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
            Password Recovery
          </h2>
          <p className="text-xs text-mutedGray">
            Enter your registered email and we'll send you recovery instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-forest-subtle text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-forest mx-auto" />
            <p className="text-sm font-semibold text-forest-dark">
              Recovery link dispatched!
            </p>
            <p className="text-xs text-mutedGray">
              Check {email} for instructions to reset your account password.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal">Registered Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com"
                className="text-xs"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full text-xs">
              Send Password Reset Link
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-mutedGray hover:text-forest">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

