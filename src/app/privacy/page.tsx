import Link from "next/link";
import { ShieldCheck, Lock, MapPin, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Data Protection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark">
          Privacy Policy
        </h1>
        <p className="text-xs text-mutedGray">
          Last updated: November 2026 · NextReader Trust & Safety
        </p>
      </div>

      <div className="prose prose-forest text-xs sm:text-sm text-charcoal/80 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            1. Our Commitment to Reader Privacy
          </h2>
          <p>
            NextReader is built to encourage community sharing while upholding strict personal privacy. We never sell your personal data or distribute your contact details to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            2. Residential Address Masking
          </h2>
          <p>
            Your exact home or apartment address is <strong>never</strong> displayed publicly. Public book listings only display your approximate locality (e.g. "Kakkanad, Kochi" or "Indiranagar, Bengaluru"). Exact pickup spots are arranged privately between verified participants once a borrowing or exchange request has been officially accepted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            3. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Information:</strong> Display name, username, email address, city, and locality.</li>
            <li><strong>Bookshelf Data:</strong> Book titles, bibliographic details, condition notes, and photos you choose to upload.</li>
            <li><strong>Transaction Records:</strong> Requests, confirmed handovers, return dates, and reviews submitted.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-forest-dark">
            4. Security & Storage
          </h2>
          <p>
            Data persistence and authentication are safeguarded via PostgreSQL Row Level Security (RLS). Server-side authorization prevents unauthorized access or tampering with personal records.
          </p>
        </section>
      </div>
    </div>
  );
}

