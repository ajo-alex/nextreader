import Link from "next/link";
import { 
  BookMarked, BookOpen, HeartHandshake, Inbox, PlusCircle, 
  ArrowRight, Clock, AlertTriangle, CheckCircle2, Star, Sparkles, MapPin 
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await repository.getCurrentUser();

  const [myBooks, myBorrowedLoans, myLentLoans, incomingRequests, outgoingRequests] = await Promise.all([
    repository.getBooks({ ownerId: currentUser.id }),
    repository.getLoans({ userId: currentUser.id, asBorrower: true }),
    repository.getLoans({ userId: currentUser.id, asOwner: true }),
    repository.getLoanRequests({ userId: currentUser.id, type: "incoming" }),
    repository.getLoanRequests({ userId: currentUser.id, type: "outgoing" }),
  ]);

  const activeBorrowed = myBorrowedLoans.filter((l) => ["borrowed", "return_initiated", "overdue"].includes(l.status));
  const activeLent = myLentLoans.filter((l) => ["borrowed", "return_initiated", "awaiting_handover", "reserved"].includes(l.status));
  const pendingIncoming = incomingRequests.filter((r) => r.status === "pending");
  const overdueBorrowed = myBorrowedLoans.filter((l) => l.status === "overdue");

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 text-left">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-surfaceBorder shadow-xs">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={currentUser.display_name}
              className="h-16 w-16 rounded-full object-cover border-2 border-forest/20 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
                  Welcome back, {currentUser.display_name.split(" ")[0]}!
                </h1>
                <span className="bg-sage text-forest-dark text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-forest-dark" />
                  {currentUser.reputation_score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-mutedGray mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-forest" />
                <span>{currentUser.locality}, {currentUser.city}</span>
                <span>·</span>
                <span>{myBooks.length} books on bookshelf</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/books/new">
              <Button variant="accent" size="sm" className="gap-1.5 font-medium">
                <PlusCircle className="h-4 w-4" />
                List a Book
              </Button>
            </Link>
            <Link href="/discover">
              <Button variant="outline" size="sm">
                Explore Books
              </Button>
            </Link>
          </div>
        </div>

        {/* Overdue Warning Alert if any */}
        {overdueBorrowed.length > 0 && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-xs font-bold text-destructive">
                  Action Required: You have {overdueBorrowed.length} overdue book loan.
                </p>
                <p className="text-[11px] text-mutedGray">
                  Please initiate return or contact the owner to request an extension.
                </p>
              </div>
            </div>
            <Link href="/my-loans">
              <Button variant="destructive" size="sm" className="text-xs">
                View Loan
              </Button>
            </Link>
          </div>
        )}

        {/* Real Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/my-books" className="group">
            <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs hover:border-forest/40 transition-all">
              <div className="flex items-center justify-between text-mutedGray mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">My Shelf</span>
                <BookMarked className="h-4 w-4 text-forest" />
              </div>
              <p className="text-3xl font-serif font-bold text-forest-dark">
                {myBooks.length}
              </p>
              <p className="text-[11px] text-mutedGray mt-1 group-hover:text-forest transition-colors">
                Manage listed books →
              </p>
            </div>
          </Link>

          <Link href="/my-loans" className="group">
            <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs hover:border-forest/40 transition-all">
              <div className="flex items-center justify-between text-mutedGray mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Borrowed</span>
                <BookOpen className="h-4 w-4 text-forest" />
              </div>
              <p className="text-3xl font-serif font-bold text-forest-dark">
                {activeBorrowed.length}
              </p>
              <p className="text-[11px] text-mutedGray mt-1 group-hover:text-forest transition-colors">
                Books currently reading →
              </p>
            </div>
          </Link>

          <Link href="/my-lending" className="group">
            <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs hover:border-forest/40 transition-all">
              <div className="flex items-center justify-between text-mutedGray mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Lent Out</span>
                <HeartHandshake className="h-4 w-4 text-forest" />
              </div>
              <p className="text-3xl font-serif font-bold text-forest-dark">
                {activeLent.length}
              </p>
              <p className="text-[11px] text-mutedGray mt-1 group-hover:text-forest transition-colors">
                Books with other readers →
              </p>
            </div>
          </Link>

          <Link href="/requests" className="group">
            <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs hover:border-forest/40 transition-all">
              <div className="flex items-center justify-between text-mutedGray mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Requests</span>
                <Inbox className="h-4 w-4 text-accentOrange" />
              </div>
              <p className="text-3xl font-serif font-bold text-forest-dark">
                {pendingIncoming.length}
              </p>
              <p className="text-[11px] text-mutedGray mt-1 group-hover:text-forest transition-colors">
                Pending incoming requests →
              </p>
            </div>
          </Link>
        </div>

        {/* Main Grid: Active Loans & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Loans & Return Due Dates */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Borrowed Books */}
            <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-forest-dark flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-forest" />
                  Currently Borrowed by You
                </h3>
                <Link href="/my-loans" className="text-xs font-semibold text-forest hover:underline">
                  View All
                </Link>
              </div>

              {activeBorrowed.length > 0 ? (
                <div className="space-y-3">
                  {activeBorrowed.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 rounded-2xl border border-surfaceBorder bg-cream/30 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={loan.book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                          alt={loan.book?.title || "Book"}
                          className="h-14 w-10 object-cover rounded-md border shadow-xs"
                        />
                        <div>
                          <Link href={`/books/${loan.book_id}`} className="font-serif font-bold text-sm text-forest-dark hover:underline">
                            {loan.book?.title}
                          </Link>
                          <p className="text-xs text-mutedGray">
                            Lender: {loan.owner?.display_name} · {loan.owner?.locality}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            <span className="text-mutedGray flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Due {formatDate(loan.due_date)}
                            </span>
                            {loan.status === "overdue" && (
                              <span className="text-destructive font-bold uppercase text-[10px]">Overdue</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link href="/my-loans">
                        <Button variant="outline" size="sm" className="text-xs">
                          Return Action
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-mutedGray bg-cream/20 rounded-2xl border border-dashed border-surfaceBorder">
                  <p>You aren't borrowing any books right now.</p>
                  <Link href="/discover" className="text-forest font-bold underline mt-1 block">
                    Find books nearby
                  </Link>
                </div>
              )}
            </div>

            {/* Pending Requests To Review */}
            <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-forest-dark flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-accentOrange" />
                  Incoming Borrow Requests ({pendingIncoming.length})
                </h3>
                <Link href="/requests" className="text-xs font-semibold text-forest hover:underline">
                  Manage Requests
                </Link>
              </div>

              {pendingIncoming.length > 0 ? (
                <div className="space-y-3">
                  {pendingIncoming.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-surfaceBorder bg-cream/30 flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="font-serif font-bold text-sm text-forest-dark block">
                          {req.borrower?.display_name} requested "{req.book?.title}"
                        </span>
                        <p className="text-xs text-mutedGray italic mt-0.5">
                          "{req.message || "No message attached"}"
                        </p>
                        <span className="text-[11px] text-mutedGray block mt-1">
                          Duration: {req.requested_duration_days} days · {req.borrower?.locality}
                        </span>
                      </div>

                      <Link href="/requests">
                        <Button variant="primary" size="sm" className="text-xs">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-mutedGray">
                  No pending incoming requests. Your books are ready on your shelf.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Navigation & Community Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-forest-dark">
                Quick Shortcuts
              </h3>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/books/new"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cream text-charcoal transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <PlusCircle className="h-4 w-4 text-forest" /> Add Book to Shelf
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-mutedGray" />
                </Link>
                <Link
                  href="/community"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cream text-charcoal transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Sparkles className="h-4 w-4 text-forest" /> Wanted Books Board
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-mutedGray" />
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cream text-charcoal transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <BookOpen className="h-4 w-4 text-forest" /> Reader Conversations
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-mutedGray" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cream text-charcoal transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Star className="h-4 w-4 text-forest" /> Reputation & Reviews
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-mutedGray" />
                </Link>
              </div>
            </div>

            {/* Platform Sustainability Note */}
            <div className="rounded-3xl border border-surfaceBorder bg-forest text-white p-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sage">
                Community Impact
              </span>
              <p className="font-serif text-lg font-bold">
                100% Circular Reading
              </p>
              <p className="text-xs text-sage leading-relaxed">
                Every physical book you lend saves paper, reduces carbon footprints, and connects a local bibliophile to your favourite story.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
