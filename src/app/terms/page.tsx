import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 text-left">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mutedGray hover:text-forest transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest bg-sage px-3 py-1 rounded-full">
          Platform Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark">
          Terms of Service & Lending Code
        </h1>
        <p className="text-xs text-mutedGray">
          Last updated: November 2026 · NextReader Community Agreement
        </p>
      </div>

      <div className="prose prose-forest text-xs sm:text-sm text-charcoal/80 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            1. Community Code of Conduct
          </h2>
          <p>
            By participating in NextReader, you agree to treat fellow readers with mutual respect, care for borrowed books as if they were your own, and return physical copies promptly on or before agreed due dates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            2. Lending & Handover Rules
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Book owners must honestly declare book condition (Like New, Very Good, Good, Acceptable).</li>
            <li>Borrowers must inspect the book at handover. Any pre-existing marks or tear should be confirmed immediately.</li>
            <li>Handover and final return must be confirmed in the platform to update loan status and trigger mutual review eligibility.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            3. Paid Rentals & Security Deposits
          </h2>
          <p>
            For paid rentals, security deposits are held in trust and refunded upon confirmed return. Deductions for damage or loss require administrative dispute review with photo evidence.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            4. Reviews & Dispute Resolution
          </h2>
          <p>
            Only users who engaged in a completed eligible transaction may leave reviews. Fabricated, defamatory, or self-reviews are strictly forbidden and subject to removal by platform administrators.
          </p>
        </section>
      </div>
    </div>
  );
}

