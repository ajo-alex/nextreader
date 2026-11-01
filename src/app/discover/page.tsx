import { Suspense } from "react";
import { repository } from "@/lib/data/repository";
import { DiscoverFilters } from "@/components/discover/discover-filters";
import { BookGrid } from "@/components/books/book-grid";
import { Sparkles, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface DiscoverPageProps {
  searchParams: Promise<{
    search?: string;
    genre?: string;
    language?: string;
    lending_type?: string;
    condition?: string;
    city?: string;
    sortBy?: string;
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;

  const [books, currentUser, wishlist] = await Promise.all([
    repository.getBooks({
      search: params.search,
      genre: params.genre,
      language: params.language,
      lending_type: params.lending_type,
      condition: params.condition,
      city: params.city,
      sortBy: params.sortBy,
    }),
    repository.getCurrentUser(),
    repository.getUserWishlist("a0000000-0000-0000-0000-000000000001"),
  ]);

  const wishlistBookIds = wishlist.map((w) => w.book_id);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-forest-dark text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="h-3.5 w-3.5" /> Physical Book Discovery
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark">
          Discover Books in Your Community
        </h1>
        <p className="text-mutedGray text-sm mt-1 max-w-2xl">
          Browse real books listed by local readers in Kochi, Bengaluru, and nearby circles.
          Showing <span className="font-bold text-forest-dark">{books.length}</span> available copies.
        </p>
      </div>

      {/* Filters Toolbar */}
      <Suspense fallback={<div className="h-20 bg-white rounded-2xl animate-pulse" />}>
        <DiscoverFilters />
      </Suspense>

      {/* Book Grid */}
      <BookGrid
        books={books}
        wishlistBookIds={wishlistBookIds}
        emptyMessage="We couldn't find any books matching your exact search or filter criteria. Try clearing some filters or search for another author."
        emptyActionHref="/discover"
        emptyActionLabel="Reset All Filters"
      />
    </div>
  );
}
