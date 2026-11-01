"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Edit, ArrowLeftRight, CreditCard, Lock, HeartHandshake } from "lucide-react";
import { Book, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { BorrowRequestDialog } from "./borrow-request-dialog";

interface BookDetailsActionsProps {
  book: Book;
  currentUser: Profile;
  userOwnedBooks: Book[];
}

export function BookDetailsActions({ book, currentUser, userOwnedBooks }: BookDetailsActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isOwner = currentUser.id === book.owner_id;
  const isAvailable = book.availability_status === "available";

  if (isOwner) {
    return (
      <div className="rounded-2xl border border-surfaceBorder bg-cream/50 p-5 space-y-3">
        <p className="text-xs font-semibold text-forest-dark flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-forest" />
          You listed this book on your bookshelf.
        </p>
        <div className="flex items-center gap-3">
          <Link href={`/books/${book.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit Listing
            </Button>
          </Link>
          <Link href="/my-books">
            <Button variant="ghost" size="sm">
              Manage in My Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="rounded-2xl border border-surfaceBorder bg-cream/30 p-5 space-y-2">
        <div className="flex items-center gap-2 text-charcoal font-semibold text-sm">
          <Lock className="h-4 w-4 text-mutedGray" />
          <span>Currently on active loan</span>
        </div>
        <p className="text-xs text-mutedGray">
          This physical copy is currently with another reader. You can add it to your wishlist to receive a notification once returned.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {book.lending_type === "free" && (
          <Button
            size="lg"
            variant="primary"
            onClick={() => setIsDialogOpen(true)}
            className="w-full gap-2 font-semibold shadow-md"
          >
            <BookOpen className="h-5 w-5" />
            Request to Borrow (Free)
          </Button>
        )}

        {book.lending_type === "rental" && (
          <Button
            size="lg"
            variant="accent"
            onClick={() => setIsDialogOpen(true)}
            className="w-full gap-2 font-semibold shadow-md"
          >
            <CreditCard className="h-5 w-5" />
            Request Rental (₹{book.rental_price} / {book.lending_duration_days} days)
          </Button>
        )}

        {book.lending_type === "exchange" && (
          <Button
            size="lg"
            variant="primary"
            onClick={() => setIsDialogOpen(true)}
            className="w-full gap-2 font-semibold shadow-md bg-[#1E3A5F] hover:bg-[#162D4A]"
          >
            <ArrowLeftRight className="h-5 w-5" />
            Propose a Book Exchange
          </Button>
        )}

        <p className="text-[11px] text-center text-mutedGray">
          Physical handover arranged directly with {book.owner?.display_name || "the owner"}.
        </p>
      </div>

      <BorrowRequestDialog
        book={book}
        currentUser={currentUser}
        userOwnedBooks={userOwnedBooks}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

