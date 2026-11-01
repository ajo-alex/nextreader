import Link from "next/link";
import { Heart, BookOpen, Trash2 } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const currentUser = await repository.getCurrentUser();
  const wishlistItems = await repository.getUserWishlist(currentUser.id);
  const books = wishlistItems.map((item) => item.book).filter(Boolean) as any[];

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Heart className="h-7 w-7 text-destructive fill-destructive" />
            My Wishlist ({books.length})
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Saved books you want to read next. We track their availability so you can borrow when ready.
          </p>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isFavorited={true}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center space-y-3">
            <Heart className="h-10 w-10 text-mutedGray mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-mutedGray max-w-sm mx-auto">
              Save books as you explore the community collection by clicking the heart button on any book card.
            </p>
            <div className="pt-2">
              <Link href="/discover">
                <Button variant="primary" size="sm">
                  Explore Books
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
