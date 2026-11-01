import Link from "next/link";
import { MapPin, Star, Clock, ArrowLeftRight } from "lucide-react";
import { Book } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "./favorite-button";
import { formatCurrency } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  isFavorited?: boolean;
}

export function BookCard({ book, isFavorited = false }: BookCardProps) {
  const conditionLabels: Record<string, string> = {
    like_new: "Like New",
    very_good: "Very Good",
    good: "Good",
    acceptable: "Acceptable",
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-surfaceBorder bg-white overflow-hidden book-card-shadow transition-all duration-300">
      {/* Top Media & Cover */}
      <div className="relative aspect-[3/4] w-full bg-[#EAE7DC] overflow-hidden">
        <img
          src={book.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Favorite Button Overlay */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton bookId={book.id} initialFavorited={isFavorited} />
        </div>

        {/* Badges on Cover */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
          {book.lending_type === "free" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sage/95 text-forest-dark backdrop-blur-sm shadow-sm">
              Free Lending
            </span>
          )}
          {book.lending_type === "rental" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/95 text-[#A85A14] backdrop-blur-sm shadow-sm">
              {formatCurrency(book.rental_price)} / {book.lending_duration_days}d
            </span>
          )}
          {book.lending_type === "exchange" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#E8EEF5]/95 text-[#1E3A5F] backdrop-blur-sm shadow-sm">
              <ArrowLeftRight className="h-3 w-3" /> Exchange
            </span>
          )}
        </div>

        {/* Availability Badge */}
        {book.availability_status === "on_loan" && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" /> On Loan
            </span>
          </div>
        )}
      </div>

      {/* Book Metadata */}
      <div className="flex flex-1 flex-col p-4">
        {/* Genre & Condition */}
        <div className="flex items-center justify-between text-[11px] text-mutedGray mb-1.5">
          <span className="font-medium tracking-wide uppercase">{book.genre}</span>
          <span className="bg-cream-dark px-1.5 py-0.5 rounded text-[10px] font-medium text-charcoal/80">
            {conditionLabels[book.condition] || book.condition}
          </span>
        </div>

        {/* Title */}
        <Link href={`/books/${book.id}`} className="group-hover:text-forest transition-colors">
          <h3 className="font-serif text-base font-bold text-forest-dark leading-snug line-clamp-2">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-xs text-mutedGray mt-0.5 mb-3 line-clamp-1">
          by <span className="text-charcoal font-medium">{book.author}</span>
        </p>

        {/* Owner & Location footer */}
        <div className="mt-auto pt-3 border-t border-surfaceBorder/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            {book.owner?.avatar_url ? (
              <img
                src={book.owner.avatar_url}
                alt={book.owner.display_name}
                className="h-5 w-5 rounded-full object-cover border border-surfaceBorder shrink-0"
              />
            ) : (
              <span className="flex h-5 w-5 rounded-full bg-forest text-[10px] text-white items-center justify-center font-bold shrink-0">
                {book.owner?.display_name ? book.owner.display_name[0] : "R"}
              </span>
            )}
            <span className="text-mutedGray text-[11px] truncate">
              {book.owner?.display_name || "Community Reader"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-mutedGray font-medium shrink-0">
            <MapPin className="h-3 w-3 text-forest" />
            <span>{book.locality}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

