import { Book } from "@/types/database";
import { BookCard } from "./book-card";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BookGridProps {
  books: Book[];
  wishlistBookIds?: string[];
  emptyMessage?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
}

export function BookGrid({
  books,
  wishlistBookIds = [],
  emptyMessage = "No books found matching your criteria.",
  emptyActionHref = "/discover",
  emptyActionLabel = "Clear Filters"
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-surfaceBorder bg-white/60">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-dark text-mutedGray mb-4">
          <BookOpen className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-lg font-bold text-forest-dark mb-1">
          No books found
        </h3>
        <p className="text-sm text-mutedGray max-w-md mb-6">
          {emptyMessage}
        </p>
        {emptyActionHref && (
          <Link href={emptyActionHref}>
            <Button variant="outline" size="sm">
              {emptyActionLabel}
            </Button>
          </Link>
        )}
      </div>
    );
  }

  const wishlistSet = new Set(wishlistBookIds);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorited={wishlistSet.has(book.id)}
        />
      ))}
    </div>
  );
}

