import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye, Clock, MapPin, BookOpen, AlertCircle } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { deleteBookAction } from "@/actions";

export const dynamic = "force-dynamic";

interface MyBooksPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyBooksPage({ searchParams }: MyBooksPageProps) {
  const { tab = "all" } = await searchParams;
  const currentUser = await repository.getCurrentUser();
  const allUserBooks = await repository.getBooks({ ownerId: currentUser.id });

  const availableBooks = allUserBooks.filter((b) => b.availability_status === "available");
  const onLoanBooks = allUserBooks.filter((b) => b.availability_status === "on_loan");
  const reservedBooks = allUserBooks.filter((b) => b.availability_status === "reserved");
  const unavailableBooks = allUserBooks.filter((b) => b.availability_status === "unavailable");

  let displayedBooks = allUserBooks;
  if (tab === "available") displayedBooks = availableBooks;
  if (tab === "on_loan") displayedBooks = onLoanBooks;
  if (tab === "reserved") displayedBooks = reservedBooks;
  if (tab === "unavailable") displayedBooks = unavailableBooks;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest-dark">
              My Bookshelf
            </h1>
            <p className="text-sm text-mutedGray mt-0.5">
              Manage your listed physical books, view borrowing demand, and update availability.
            </p>
          </div>

          <Link href="/books/new">
            <Button variant="accent" size="md" className="gap-2 font-medium">
              <PlusCircle className="h-4 w-4" />
              <span>Add New Book</span>
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-surfaceBorder pb-2 overflow-x-auto text-xs font-medium">
          {[
            { id: "all", label: `All Books (${allUserBooks.length})` },
            { id: "available", label: `Available (${availableBooks.length})` },
            { id: "on_loan", label: `On Loan (${onLoanBooks.length})` },
            { id: "reserved", label: `Reserved (${reservedBooks.length})` },
            { id: "unavailable", label: `Unavailable (${unavailableBooks.length})` },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/my-books?tab=${t.id}`}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "bg-forest text-white font-semibold"
                  : "bg-white text-charcoal border border-surfaceBorder hover:bg-cream"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Books Table / Card List */}
        {displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl border border-surfaceBorder bg-white p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="h-28 w-20 object-cover rounded-xl border border-surfaceBorder shrink-0 bg-cream-dark"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-mutedGray">
                        {book.genre}
                      </span>
                      <span className="text-[10px] bg-cream-dark px-1.5 py-0.2 rounded text-charcoal">
                        {book.language}
                      </span>
                    </div>

                    <Link href={`/books/${book.id}`} className="font-serif font-bold text-base text-forest-dark hover:underline line-clamp-1 block">
                      {book.title}
                    </Link>

                    <p className="text-xs text-mutedGray line-clamp-1">
                      by {book.author}
                    </p>

                    <div className="pt-1 flex flex-wrap gap-1 text-[11px]">
                      {book.lending_type === "free" && (
                        <span className="bg-sage text-forest-dark px-2 py-0.5 rounded font-semibold">
                          Free Lending
                        </span>
                      )}
                      {book.lending_type === "rental" && (
                        <span className="bg-accentOrange-light text-[#A85A14] px-2 py-0.5 rounded font-semibold">
                          {formatCurrency(book.rental_price)} / {book.lending_duration_days}d
                        </span>
                      )}
                      {book.lending_type === "exchange" && (
                        <span className="bg-[#E8EEF5] text-[#1E3A5F] px-2 py-0.5 rounded font-semibold">
                          Exchange
                        </span>
                      )}
                      <span className="bg-cream px-2 py-0.5 rounded text-mutedGray font-medium">
                        {book.availability_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-surfaceBorder/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-mutedGray text-[11px]">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{book.view_count || 0} views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/books/${book.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        View
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteBookAction(book.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-1.5 text-mutedGray hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-mutedGray mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              No books in this tab
            </h3>
            <p className="text-xs text-mutedGray max-w-sm mx-auto">
              You haven't listed any books in this category yet. Start sharing the books sitting unused on your shelf!
            </p>
            <div className="pt-2">
              <Link href="/books/new">
                <Button variant="accent" size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  List a Book
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

