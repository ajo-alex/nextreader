import Link from "next/link";
import { Inbox, ArrowLeftRight, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { RequestActionsClient } from "@/components/requests/request-actions-client";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface RequestsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const { tab = "incoming" } = await searchParams;
  const currentUser = await repository.getCurrentUser();

  const [incomingRequests, outgoingRequests, exchangeProposals] = await Promise.all([
    repository.getLoanRequests({ userId: currentUser.id, type: "incoming" }),
    repository.getLoanRequests({ userId: currentUser.id, type: "outgoing" }),
    repository.getExchangeProposals(currentUser.id),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark">
            Borrowing & Exchange Requests
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Review incoming requests from other readers or track the status of books you requested.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-surfaceBorder pb-2 overflow-x-auto text-xs font-medium">
          <Link
            href="/requests?tab=incoming"
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              tab === "incoming"
                ? "bg-forest text-white font-semibold"
                : "bg-white text-charcoal border border-surfaceBorder hover:bg-cream"
            }`}
          >
            Incoming Requests ({incomingRequests.length})
          </Link>
          <Link
            href="/requests?tab=outgoing"
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              tab === "outgoing"
                ? "bg-forest text-white font-semibold"
                : "bg-white text-charcoal border border-surfaceBorder hover:bg-cream"
            }`}
          >
            Outgoing Requests ({outgoingRequests.length})
          </Link>
          <Link
            href="/requests?tab=exchanges"
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              tab === "exchanges"
                ? "bg-forest text-white font-semibold"
                : "bg-white text-charcoal border border-surfaceBorder hover:bg-cream"
            }`}
          >
            Exchange Proposals ({exchangeProposals.length})
          </Link>
        </div>

        {/* Tab 1: Incoming Requests */}
        {tab === "incoming" && (
          <div className="space-y-4">
            {incomingRequests.length > 0 ? (
              incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={req.book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                      alt={req.book?.title || "Book"}
                      className="h-24 w-16 object-cover rounded-xl border shrink-0 bg-cream-dark"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          req.status === "pending" ? "bg-accentOrange-light text-[#A85A14]" :
                          req.status === "accepted" ? "bg-[#E3F2E6] text-[#1B5E20]" :
                          "bg-cream-dark text-mutedGray"
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[11px] text-mutedGray">
                          Requested on {formatDate(req.created_at)}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-forest-dark">
                        {req.borrower?.display_name} requested "{req.book?.title}"
                      </h3>

                      <p className="text-xs text-mutedGray italic">
                        "{req.message || "Hi, I'd like to borrow your copy!"}"
                      </p>

                      <div className="flex items-center gap-3 text-xs text-mutedGray pt-1">
                        <span>Duration: <strong>{req.requested_duration_days} days</strong></span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-forest" />
                          {req.borrower?.locality}, {req.borrower?.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {req.status === "pending" ? (
                    <RequestActionsClient requestId={req.id} type="loan" />
                  ) : (
                    <span className="text-xs font-semibold text-mutedGray capitalize">
                      Status: {req.status}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center text-xs text-mutedGray">
                No incoming requests yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Outgoing Requests */}
        {tab === "outgoing" && (
          <div className="space-y-4">
            {outgoingRequests.length > 0 ? (
              outgoingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={req.book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                      alt={req.book?.title || "Book"}
                      className="h-24 w-16 object-cover rounded-xl border shrink-0 bg-cream-dark"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          req.status === "pending" ? "bg-accentOrange-light text-[#A85A14]" :
                          req.status === "accepted" ? "bg-[#E3F2E6] text-[#1B5E20]" :
                          "bg-cream-dark text-mutedGray"
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-forest-dark">
                        You requested "{req.book?.title}"
                      </h3>

                      <p className="text-xs text-mutedGray">
                        Owner: <strong>{req.owner?.display_name}</strong> ({req.owner?.locality})
                      </p>

                      <p className="text-xs text-mutedGray pt-1">
                        Requested for {req.requested_duration_days} days · Submitted {formatDate(req.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs">
                    {req.status === "accepted" ? (
                      <Link href="/my-loans" className="text-forest font-bold hover:underline">
                        View in Active Loans →
                      </Link>
                    ) : (
                      <span className="text-mutedGray">
                        Awaiting owner response
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center text-xs text-mutedGray">
                You haven't requested any books yet. Browse the discover catalogue to find books nearby.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Exchange Proposals */}
        {tab === "exchanges" && (
          <div className="space-y-4">
            {exchangeProposals.length > 0 ? (
              exchangeProposals.map((proposal) => {
                const isProposer = proposal.proposer_id === currentUser.id;
                return (
                  <div
                    key={proposal.id}
                    className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      {/* Offered Book */}
                      <div className="text-center">
                        <img
                          src={proposal.offered_book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                          alt="Offered"
                          className="h-20 w-14 object-cover rounded-lg border mx-auto bg-cream-dark"
                        />
                        <span className="text-[10px] font-bold text-forest-dark block mt-1 max-w-[80px] truncate">
                          {proposal.offered_book?.title}
                        </span>
                        <span className="text-[9px] text-mutedGray">Offered</span>
                      </div>

                      <ArrowLeftRight className="h-5 w-5 text-forest shrink-0" />

                      {/* Requested Book */}
                      <div className="text-center">
                        <img
                          src={proposal.requested_book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
                          alt="Requested"
                          className="h-20 w-14 object-cover rounded-lg border mx-auto bg-cream-dark"
                        />
                        <span className="text-[10px] font-bold text-forest-dark block mt-1 max-w-[80px] truncate">
                          {proposal.requested_book?.title}
                        </span>
                        <span className="text-[9px] text-mutedGray">Requested</span>
                      </div>

                      {/* Proposal Details */}
                      <div className="ml-2 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage text-forest-dark">
                          {proposal.status}
                        </span>
                        <p className="text-xs text-charcoal font-semibold">
                          {isProposer ? (
                            `You proposed this exchange to ${proposal.recipient?.display_name}`
                          ) : (
                            `${proposal.proposer?.display_name} proposed this exchange`
                          )}
                        </p>
                        {proposal.handover_arrangement && (
                          <p className="text-xs text-mutedGray">
                            Arrangement: {proposal.handover_arrangement}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isProposer && proposal.status === "pending" ? (
                      <RequestActionsClient requestId={proposal.id} type="exchange" />
                    ) : (
                      <span className="text-xs font-semibold text-mutedGray capitalize">
                        {proposal.status}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center text-xs text-mutedGray">
                No active exchange proposals.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
