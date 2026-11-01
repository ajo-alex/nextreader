import Link from "next/link";
import { BookOpen, RefreshCw, Users, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12 text-left">
      <div className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest bg-sage px-3 py-1 rounded-full">
          Our Story & Mission
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-dark tracking-tight leading-tight">
          Every book deserves another reader.
        </h1>
        <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-serif italic">
          "Millions of remarkable physical books sit untouched on private shelves after a single reading, while eager readers nearby hesitate to buy new copies."
        </p>
      </div>

      <div className="prose prose-forest text-sm sm:text-base text-charcoal/80 space-y-4 leading-relaxed">
        <p>
          NextReader was founded on a simple conviction: <strong>physical books are meant to be read, shared, and passed on</strong>. We are a community-powered book-sharing platform bridging readers who own books with those eager to explore them.
        </p>
        <p>
          Whether it’s a Malayalam literary classic like <em>Aadujeevitham</em> or <em>Chemmeen</em>, an advanced distributed systems textbook, or an engaging science fiction novel, books possess an enduring tactile magic that digital readers simply cannot replicate.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-2">
          <div className="h-10 w-10 rounded-xl bg-forest-subtle text-forest flex items-center justify-center">
            <RefreshCw className="h-5 w-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-forest-dark">
            Sustainable Circulation
          </h3>
          <p className="text-xs text-mutedGray leading-relaxed">
            Reducing paper waste and manufacturing overhead by extending the life of physical copies through neighbourhood circulation.
          </p>
        </div>

        <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-2">
          <div className="h-10 w-10 rounded-xl bg-forest-subtle text-forest flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-forest-dark">
            Accessible Knowledge
          </h3>
          <p className="text-xs text-mutedGray leading-relaxed">
            Ensuring college students, budget-conscious readers, and book lovers can explore literature affordably or completely free.
          </p>
        </div>

        <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-2">
          <div className="h-10 w-10 rounded-xl bg-forest-subtle text-forest flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-forest-dark">
            Neighbourhood Trust
          </h3>
          <p className="text-xs text-mutedGray leading-relaxed">
            Fostering genuine human connections between people in the same apartment complexes, colleges, and reading circles.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-surfaceBorder bg-cream p-8 space-y-4">
        <h3 className="font-serif font-bold text-xl text-forest-dark">
          Our Footprint
        </h3>
        <p className="text-xs text-mutedGray leading-relaxed">
          Starting with reading circles across Kochi (Kakkanad, Fort Kochi, Palarivattom) and Bengaluru (Indiranagar, Koramangala), NextReader is building a network of local community bookshelves across India.
        </p>
        <div className="pt-2">
          <Link href="/discover">
            <Button variant="primary" size="sm" className="gap-2">
              <span>Start Exploring Books</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
