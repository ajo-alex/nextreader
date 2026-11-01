import Link from "next/link";
import { 
  BookOpen, ArrowRight, ShieldCheck, HeartHandshake, 
  Sparkles, RefreshCw, Users, CheckCircle2, ChevronRight,
  MapPin, Shield, Clock, BookMarked, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/data/repository";
import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedSection } from "@/components/home/featured-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [currentUser, allBooks, wishlist] = await Promise.all([
    repository.getCurrentUser(),
    repository.getBooks(),
    repository.getUserWishlist("a0000000-0000-0000-0000-000000000001"),
  ]);

  const wishlistBookIds = wishlist.map((w) => w.book_id);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#F5F1E8] border-b border-surfaceBorder">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-sage/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-accentOrange/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-subtle border border-forest/10 text-forest font-semibold text-xs uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-forest animate-pulse" />
                Community-Powered Book Sharing
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-dark tracking-tight leading-[1.12]">
                Every book deserves another reader.
              </h1>

              <p className="text-base sm:text-lg text-charcoal/80 max-w-xl leading-relaxed">
                Discover books in your community, lend the stories you’ve finished, and find your next favourite read without buying every book.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/discover">
                  <Button size="lg" variant="primary" className="gap-2 font-medium">
                    <span>Explore Books</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/books/new">
                  <Button size="lg" variant="outline" className="border-forest text-forest hover:bg-forest/5 font-medium">
                    <span>Share Your Books</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Search */}
              <div className="pt-4">
                <HeroSearch />
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 text-xs text-mutedGray">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Free & Affordable Lending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Verified Readers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Physical Handover</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Composition: Layered Physical Book Covers */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="relative z-20 rounded-3xl bg-white p-5 shadow-2xl border border-surfaceBorder transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-dark mb-4 relative">
                    <img
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"
                      alt="Aadujeevitham"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-lg text-xs font-semibold text-forest-dark shadow-sm">
                      Free Lending · Kakkanad, Kochi
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-forest-dark">
                        Aadujeevitham (ആടുജീവിതം)
                      </h4>
                      <p className="text-xs text-mutedGray">by Benyamin · Malayalam</p>
                    </div>
                    <span className="bg-sage text-forest-dark text-[11px] font-bold px-2 py-0.5 rounded-full">
                      Like New
                    </span>
                  </div>
                </div>

                {/* Layered Second Card behind */}
                <div className="absolute -top-6 -right-6 z-10 w-4/5 rounded-3xl bg-[#EBE7DC] p-4 shadow-lg border border-surfaceBorder/80 opacity-90 hidden sm:block">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-white mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                      alt="Project Hail Mary"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="font-serif text-xs font-bold text-forest-dark truncate">
                    Project Hail Mary · Fort Kochi
                  </p>
                </div>

                {/* Floating Metric Pill */}
                <div className="absolute -bottom-6 -left-6 z-30 rounded-2xl bg-white p-4 shadow-xl border border-surfaceBorder flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white">
                    <BookMarked className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-forest-dark">20+ Neighborhoods</p>
                    <p className="text-[11px] text-mutedGray">Connecting Kerala & Bengaluru readers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. HOW IT WORKS */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-mutedGray">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark mt-1">
            How NextReader Works
          </h2>
          <p className="text-mutedGray text-sm sm:text-base mt-2">
            Share and borrow books with verified readers in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-surfaceBorder bg-white p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <span className="text-4xl font-serif font-bold text-sage-dark mb-4 block">
                01
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-subtle text-forest mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-dark mb-2">
                Discover
              </h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Find physical books available in your community. Search by Malayalam or English fiction, tech guides, academic classics, or distance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surfaceBorder/60 text-xs font-medium text-forest flex items-center gap-1">
              <span>Browse free, rental or exchange</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-surfaceBorder bg-white p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <span className="text-4xl font-serif font-bold text-sage-dark mb-4 block">
                02
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-subtle text-forest mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-dark mb-2">
                Borrow or Exchange
              </h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Send a request with your desired lending period. Coordinate handover via messaging and meet at a convenient neighbourhood spot.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surfaceBorder/60 text-xs font-medium text-forest flex items-center gap-1">
              <span>Owner confirms physical handover</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-surfaceBorder bg-white p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <span className="text-4xl font-serif font-bold text-sage-dark mb-4 block">
                03
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-subtle text-forest mb-4">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-dark mb-2">
                Return & Repeat
              </h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Return the book on time, leave a verified review to build your community reputation, and help someone else discover their next read.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surfaceBorder/60 text-xs font-medium text-forest flex items-center gap-1">
              <span>Build your reader score</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. FEATURED BOOKS GRID */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-[#FAF7F0] border-y border-surfaceBorder">
        <FeaturedSection books={allBooks} wishlistBookIds={wishlistBookIds} />
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. COMMUNITY & WANTED REQUESTS SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-forest text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-forest-light/40 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sage text-xs font-semibold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" /> Neighborhood Book Hubs
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Your neighbourhood is full of stories.
            </h2>
            <p className="text-sage text-sm sm:text-base leading-relaxed">
              Discover the books sitting on shelves around you in Kakkanad, Fort Kochi, Indiranagar, and beyond. Request a book someone owns or respond to readers searching for a title.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/community">
                <Button size="lg" variant="accent" className="font-medium gap-2">
                  <span>Visit Community Board</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 font-medium">
                  <span>Explore Local Circles</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 5. BENEFITS SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark">
            Why Share on NextReader?
          </h2>
          <p className="text-mutedGray text-sm sm:text-base mt-2">
            A smarter, more sustainable way to enjoy physical reading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest-dark mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest-dark mb-1">
              Save Money on Reading
            </h4>
            <p className="text-xs text-mutedGray leading-relaxed">
              Access hardcovers and translated literature without paying full retail prices for books you will only read once.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest-dark mb-4">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest-dark mb-1">
              Give Books a Second Life
            </h4>
            <p className="text-xs text-mutedGray leading-relaxed">
              Don't leave beloved books gathering dust. Keep great literature circulating through active readers in your city.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest-dark mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest-dark mb-1">
              Discover Unexpected Reads
            </h4>
            <p className="text-xs text-mutedGray leading-relaxed">
              Find rare regional editions, Malayalam novels, and niche technical treatises you won't spot in mainstream algorithm feeds.
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest-dark mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest-dark mb-1">
              Connect With Readers
            </h4>
            <p className="text-xs text-mutedGray leading-relaxed">
              Meet neighbours who share your exact literary taste and build lasting trust in local reading circles.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 6. HOW SHARING WORKS FOR OWNERS */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-surfaceBorder">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-mutedGray">
              For Book Owners
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark leading-tight">
              Your bookshelf could be someone's next adventure.
            </h2>
            <p className="text-mutedGray text-sm sm:text-base leading-relaxed">
              Listing a book takes under two minutes. You decide whether to lend it freely, propose an exchange, or charge a modest rental fee with a refundable deposit.
            </p>

            <ul className="space-y-3 text-sm text-charcoal">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span>You set your lending rules, duration, and pickup preference.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span>Review reader profiles, ratings, and past return history before accepting.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span>Automated due-date reminders keep borrowers accountable.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/books/new">
                <Button size="lg" variant="primary" className="font-medium gap-2">
                  <span>List Your First Book</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-surfaceBorder bg-cream p-8 shadow-sm text-left space-y-4">
            <h4 className="font-serif font-bold text-xl text-forest-dark">
              Trust & Safety Architecture
            </h4>
            <p className="text-xs text-mutedGray leading-relaxed">
              We know physical books have sentimental and financial value. NextReader enforces real accountability:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded-xl bg-white p-3 border border-surfaceBorder/80">
                <span className="font-bold text-forest-dark block mb-1">Condition Records</span>
                <span className="text-mutedGray">Photos and condition logged at handover and return.</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-surfaceBorder/80">
                <span className="font-bold text-forest-dark block mb-1">Refundable Deposits</span>
                <span className="text-mutedGray">Optional security deposits held safely during paid rentals.</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-surfaceBorder/80">
                <span className="font-bold text-forest-dark block mb-1">Mutual Reviews</span>
                <span className="text-mutedGray">Only verified participants can review completed transactions.</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-surfaceBorder/80">
                <span className="font-bold text-forest-dark block mb-1">Dispute Desk</span>
                <span className="text-mutedGray">Admin review and mediation for overdue or damaged books.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

