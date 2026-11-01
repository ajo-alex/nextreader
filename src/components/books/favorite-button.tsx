"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/actions";

interface FavoriteButtonProps {
  bookId: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ bookId, initialFavorited = false }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic toggle
    setIsFavorited(!isFavorited);

    startTransition(async () => {
      const res = await toggleWishlistAction(bookId);
      if (res && res.success && res.isAdded !== undefined) {
        setIsFavorited(res.isAdded);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
        isFavorited
          ? "bg-white text-destructive scale-105"
          : "bg-white/80 text-charcoal/60 hover:text-destructive hover:bg-white"
      }`}
      aria-label={isFavorited ? "Remove from wishlist" : "Save to wishlist"}
      title={isFavorited ? "Saved to wishlist" : "Add to wishlist"}
    >
      <Heart className={`h-4 w-4 transition-transform ${isFavorited ? "fill-destructive" : ""}`} />
    </button>
  );
}
