import Link from "next/link";
import { BookOpen, AlertTriangle } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { LoanCardClient } from "@/components/loans/loan-card-client";

export const dynamic = "force-dynamic";

interface MyLoansPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyLoansPage({ searchParams }: MyLoansPageProps) {
  const { tab = "active" } = await searchParams;
  const currentUser = await repository.getCurrentUser();
  const allLoans = await repository.getLoans({ userId: currentUser.id, asBorrower: true });

  const activeLoans = allLoans.filter((l) => ["borrowed", "return_initiated", "awaiting_handover", "reserved"].includes(l.status));
  const overdueLoans = allLoans.filter((l) => l.status === "overdue");
  const returnedLoans = allLoans.filter((l) => l.status === "returned");

  let displayedLoans = allLoans;
  if (tab === "active") displayedLoans = activeLoans;
  if (tab === "overdue") displayedLoans = overdueLoans;
  if (tab === "returned") displayedLoans = returnedLoans;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark">
            My Borrowed Books
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Keep track of books you are reading, due dates, return confirmations, and lender ratings.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-surfaceBorder pb-2 overflow-x-auto text-xs font-medium">
          {[
            { id: "active", label: `Active Loans (${activeLoans.length})` },
            { id: "overdue", label: `Overdue (${overdueLoans.length})` },
            { id: "returned", label: `Completed & Returned (${returnedLoans.length})` },
            { id: "all", label: `All History (${allLoans.length})` },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/my-loans?tab=${t.id}`}
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

        {/* Loan Cards Grid */}
        {displayedLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedLoans.map((loan) => (
              <LoanCardClient
                key={loan.id}
                loan={loan}
                isBorrower={true}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-mutedGray mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              No loans in this tab
            </h3>
            <p className="text-xs text-mutedGray max-w-sm mx-auto">
              Ready to discover your next story? Browse hundreds of physical books shared by neighbours.
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
