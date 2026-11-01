import Link from "next/link";
import { 
  BookOpen, HeartHandshake, RefreshCw, ShieldCheck, 
  MapPin, CheckCircle2, ArrowRight, AlertCircle, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-16 text-left">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest bg-sage px-3 py-1 rounded-full">
          Reader's Guide
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-dark tracking-tight">
          How NextReader Works
        </h1>
        <p className="text-sm sm:text-base text-mutedGray leading-relaxed">
          NextReader connects people who own physical books with readers nearby. Here is everything you need to know about discovering, lending, borrowing, and returning stories.
        </p>
      </div>

      {/* For Borrowers */}
      <div className="space-y-6">
        <div className="border-b border-surfaceBorder pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-mutedGray">
            Step by Step
          </span>
          <h2 className="font-serif text-2xl font-bold text-forest-dark">
            For Readers Looking to Borrow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <span className="text-3xl font-serif font-bold text-sage-dark block">1</span>
            <h3 className="font-serif font-bold text-base text-forest-dark">
              Search & Discover
            </h3>
            <p className="text-xs text-mutedGray leading-relaxed">
              Explore listings filtered by language (Malayalam, English), genre, lending type (free, rental, exchange), and neighbourhood distance.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <span className="text-3xl font-serif font-bold text-sage-dark block">2</span>
            <h3 className="font-serif font-bold text-base text-forest-dark">
              Send a Request
            </h3>
            <p className="text-xs text-mutedGray leading-relaxed">
              Choose your reading period (usually 14 or 21 days) and attach a polite note to the owner. Coordinate meetup via in-app messaging.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <span className="text-3xl font-serif font-bold text-sage-dark block">3</span>
            <h3 className="font-serif font-bold text-base text-forest-dark">
              Return on Schedule
            </h3>
            <p className="text-xs text-mutedGray leading-relaxed">
              Meet back at the agreed locality spot, initiate the return, and leave a review to boost your community reputation score.
            </p>
          </div>
        </div>
      </div>

      {/* For Lenders */}
      <div className="space-y-6">
        <div className="border-b border-surfaceBorder pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-mutedGray">
            Step by Step
          </span>
          <h2 className="font-serif text-2xl font-bold text-forest-dark">
            For Book Owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <span className="text-3xl font-serif font-bold text-sage-dark block">1</span>
            <h3 className="font-serif font-bold text-base text-forest-dark">
              List in Minutes
            </h3>
            <p className="text-xs text-mutedGray leading-relaxed">
              Enter title, author, condition, and pickup locality. Decide whether you want to lend for free, propose exchanges, or charge a modest rental fee.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <span className="text-3xl font-serif font-bold text-sage-dark block">2</span>
            <h3 className="font-serif font-bold text-base text-forest-dark">
              Review Reader Profiles
            </h3>
            <p className="text-xs text-mutedGray leading-relaxed">
              You maintain 100% control over who borrows your physical books. Inspect reputation stars and past returned loans before accepting.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <span className="text-3xl font-serif font-bold text-sage-dark block">3</span>
            <h3 className="font-serif font-bold text-base text-forest-dark">
              Handover & Return Confirmation
            </h3>
            <p className="text-xs text-mutedGray leading-relaxed">
              Confirm handover with one click when you pass the book over, and confirm return when it is back on your shelf in good condition.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div id="trust" className="rounded-3xl border border-surfaceBorder bg-forest text-white p-8 sm:p-12 space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-sage flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" /> The NextReader Trust Code
        </span>
        <h2 className="font-serif text-3xl font-bold">
          Building Trust Between Readers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-sage leading-relaxed">
          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Condition Honesty</span>
            <p>Always rate your book accurately. Photos provide a clear record at handover and return.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Timely Returns</span>
            <p>Borrowers receive automated due-date reminders. Respecting return deadlines keeps the community thriving.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Address Privacy</span>
            <p>Your private residential address is never displayed on public listings. Meetups take place at convenient public neighbourhood spots.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Admin Dispute Mediation</span>
            <p>If an issue or damage occurs, our admin team inspects messages and provides fair resolution.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link href="/discover">
          <Button size="lg" variant="primary" className="gap-2 font-medium">
            <span>Explore Books Available Now</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

