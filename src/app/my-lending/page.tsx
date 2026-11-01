import Link from "next/link";
import { HeartHandshake, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { LenderActionsClient } from "@/components/loans/lender-actions-client";

export const dynamic = "force-dynamic";

interface MyLendingPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyLendingPage({ searchParams }: MyLendingPageProps) {
  const { tab = "active" } = await searchParams;
  const currentUser = await repository.getCurrentUser();
  const allLentLoans = await repository.getLoans({ userId: currentUser.id, asOwner: true });

  const activeLoans = allLentLoans.filter((l) => ["borrowed", "return_initiated", "awaiting_handover", "reserved"].includes(l.status));
  const returnedLoans = allLentLoans.filter((l) => l.status === "returned");

  let displayedLoans = allLentLoans;
  if (tab === "active") displayedLoans = activeLoans;
  if (tab === "returned") displayedLoans = returnedLoans;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark">
            Books Lent Out
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Monitor the books you've shared with others, confirm physical handovers, and close completed returns.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-surfaceBorder pb-2 overflow-x-auto text-xs font-medium">
          {[
            { id: "active", label: `Currently Lent Out (${activeLoans.length})` },
            { id: "returned", label: `Completed & Returned (${returnedLoans.length})` },
            { id: "all", label: `All History (${allLentLoans.length})` },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/my-lending?tab=${t.id}`}
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

        {displayedLoans.length > 0 ? (
          <div className="space-y-4">
            {displayedLoans.map((loan) => (
              <div
                key={loan.id}
                className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex gap-4">
                  <img
                    src={loan.book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                    alt={loan.book?.title || "Book"}
                    className="h-24 w-16 object-cover rounded-xl border shrink-0 bg-cream-dark"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage text-forest-dark">
                      {loan.status.replace("_", " ")}
                    </span>

                    <Link href={`/books/${loan.book_id}`} className="font-serif font-bold text-base text-forest-dark hover:underline line-clamp-1 block">
                      {loan.book?.title}
                    </Link>

                    <p className="text-xs text-mutedGray">
                      Borrower: <strong className="text-charcoal">{loan.borrower?.display_name}</strong> ({loan.borrower?.locality}, {loan.borrower?.city})
                    </p>

                    <div className="flex items-center gap-3 text-xs text-mutedGray pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-forest" />
                        Due: <strong>{formatDate(loan.due_date)}</strong>
                      </span>
                      {loan.handover_confirmed_at && (
                        <span>Handover: {formatDate(loan.handover_confirmed_at)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <LenderActionsClient loan={loan} />
                  <Link href="/messages" className="text-xs text-mutedGray hover:text-forest flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message borrower</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center space-y-3">
            <HeartHandshake className="h-10 w-10 text-mutedGray mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              No books currently lent out
            </h3>
            <p className="text-xs text-mutedGray max-w-sm mx-auto">
              When neighbours request books from your shelf, they will appear here once accepted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

