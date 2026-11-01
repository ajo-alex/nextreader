import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, Star, ShieldCheck, Calendar, BookOpen, 
  ArrowLeft, CheckCircle2, Info, Share2, Sparkles, AlertCircle 
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/books/favorite-button";
import { BookDetailsActions } from "@/components/books/book-details-actions";
import { BookCard } from "@/components/books/book-card";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await repository.getBookById(id);

  if (!book) {
    notFound();
  }

  // Increment views
  await repository.incrementBookViews(id);

  const [currentUser, currentUserBooks, wishlist, allBooks, ownerReviews] = await Promise.all([
    repository.getCurrentUser(),
    repository.getBooks({ ownerId: "a0000000-0000-0000-0000-000000000001" }),
    repository.getUserWishlist("a0000000-0000-0000-0000-000000000001"),
    repository.getBooks({ genre: book.genre }),
    repository.getReviewsForUser(book.owner_id),
  ]);

  const isFavorited = wishlist.some((w) => w.book_id === book.id);
  const similarBooks = allBooks.filter((b) => b.id !== book.id).slice(0, 4);

  const conditionMap: Record<string, { label: string; desc: string }> = {
    like_new: { label: "Like New", desc: "No noticeable flaws, crisp pages, intact spine." },
    very_good: { label: "Very Good", desc: "Minimal signs of prior reading, clean text." },
    good: { label: "Good", desc: "Pages and cover intact, some spine softening or notes." },
    acceptable: { label: "Acceptable", desc: "Readable with visible wear, perfectly intact story." },
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Back to Discover Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mutedGray hover:text-forest transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Main Book Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Book Cover Media */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl bg-[#EAE7DC] overflow-hidden shadow-xl border border-surfaceBorder">
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="h-full w-full object-cover"
            />
            {/* Wishlist Button */}
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton bookId={book.id} initialFavorited={isFavorited} />
            </div>

            {/* Lending Type Tag */}
            <div className="absolute bottom-4 left-4 z-10">
              {book.lending_type === "free" && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-sage text-forest-dark backdrop-blur-md shadow-sm">
                  Free Community Lending
                </span>
              )}
              {book.lending_type === "rental" && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white text-[#A85A14] backdrop-blur-md shadow-sm">
                  Paid Rental · {formatCurrency(book.rental_price)}
                </span>
              )}
              {book.lending_type === "exchange" && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#E8EEF5] text-[#1E3A5F] backdrop-blur-md shadow-sm">
                  Book Exchange
                </span>
              )}
            </div>
          </div>

          {/* Condition Box */}
          <div className="rounded-2xl border border-surfaceBorder bg-white p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-mutedGray">
                Condition Assessment
              </span>
              <span className="bg-cream-dark px-2 py-0.5 rounded text-xs font-semibold text-forest-dark">
                {conditionMap[book.condition]?.label || book.condition}
              </span>
            </div>
            <p className="text-xs text-mutedGray">
              {conditionMap[book.condition]?.desc}
            </p>
          </div>
        </div>

        {/* Right Column: Title, Metadata, CTA, Owner */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-forest-dark font-medium">
                {book.genre}
              </Badge>
              <Badge variant="outline" className="text-mutedGray font-medium">
                {book.language}
              </Badge>
              {book.availability_status === "available" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B5E20] bg-[#E3F2E6] px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Available Now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mutedGray bg-cream-dark px-2 py-0.5 rounded-full">
                  Currently on loan
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-mutedGray mt-1">
              by <span className="text-charcoal font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-cream border border-surfaceBorder text-xs">
            <div>
              <span className="text-[10px] text-mutedGray uppercase tracking-wider font-semibold block">
                Publisher
              </span>
              <span className="font-medium text-charcoal">{book.publisher || "Standard Edition"}</span>
            </div>
            <div>
              <span className="text-[10px] text-mutedGray uppercase tracking-wider font-semibold block">
                Year
              </span>
              <span className="font-medium text-charcoal">{book.publication_year || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] text-mutedGray uppercase tracking-wider font-semibold block">
                Lending Period
              </span>
              <span className="font-medium text-charcoal">{book.lending_duration_days} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-mutedGray uppercase tracking-wider font-semibold block">
                Pickup Locality
              </span>
              <span className="font-medium text-charcoal">{book.locality}, {book.city}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              About this Book
            </h3>
            <p className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Pricing breakdown for Rentals */}
          {book.lending_type === "rental" && (
            <div className="p-4 rounded-2xl border border-surfaceBorder bg-white space-y-2 text-xs">
              <h4 className="font-serif font-bold text-sm text-forest-dark">
                Rental Terms & Deposit
              </h4>
              <div className="grid grid-cols-2 gap-2 text-mutedGray">
                <div>Rental Fee: <strong className="text-charcoal">{formatCurrency(book.rental_price)}</strong> for {book.lending_duration_days} days</div>
                <div>Refundable Deposit: <strong className="text-charcoal">{formatCurrency(book.security_deposit)}</strong></div>
              </div>
              <p className="text-[11px] text-mutedGray pt-1">
                Security deposits are held securely during the loan period and refunded when the owner confirms return in good condition.
              </p>
            </div>
          )}

          {/* Primary Request Action Button */}
          <BookDetailsActions
            book={book}
            currentUser={currentUser}
            userOwnedBooks={currentUserBooks}
          />

          {/* Owner Profile Card */}
          <div className="rounded-2xl border border-surfaceBorder bg-white p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={book.owner?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={book.owner?.display_name || "Owner"}
                  className="h-12 w-12 rounded-full object-cover border border-surfaceBorder"
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-forest-dark">
                    {book.owner?.display_name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-mutedGray mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-charcoal">
                      <Star className="h-3.5 w-3.5 fill-accentOrange text-accentOrange" />
                      {book.owner?.reputation_score ? book.owner.reputation_score.toFixed(1) : "5.0"}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-forest" />
                      {book.owner?.locality}, {book.owner?.city}
                    </span>
                  </div>
                </div>
              </div>

              <Link href={`/messages`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Message
                </Button>
              </Link>
            </div>

            {book.owner?.bio && (
              <p className="text-xs text-mutedGray italic">
                "{book.owner.bio}"
              </p>
            )}

            <div className="pt-2 border-t border-surfaceBorder/60 flex items-center justify-between text-[11px] text-mutedGray">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-forest" /> Verified Community Lender
              </span>
              <span>Exact address kept private until request accepted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Books Section */}
      {similarBooks.length > 0 && (
        <div className="mt-20 pt-10 border-t border-surfaceBorder">
          <div className="mb-6 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-mutedGray">
              Recommended for You
            </span>
            <h3 className="font-serif text-2xl font-bold text-forest-dark">
              More {book.genre} Books Nearby
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarBooks.map((simBook) => (
              <BookCard key={simBook.id} book={simBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

