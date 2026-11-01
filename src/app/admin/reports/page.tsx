import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DisputeResolutionClient } from "@/components/admin/dispute-resolution-client";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const currentUser = await repository.getCurrentUser();
  if (currentUser.role !== "admin") {
    return <div className="p-8 text-center text-sm">Access denied. Admin role required.</div>;
  }

  const disputes = await repository.getDisputes();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-accentOrange" />
            Dispute & Moderation Desk ({disputes.length})
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Resolve condition discrepancies, overdue disputes, and record binding administrative decisions.
          </p>
        </div>

        {disputes.length > 0 ? (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accentOrange-light text-[#A85A14]">
                      {dispute.status}
                    </span>
                    <span className="text-xs text-mutedGray">
                      Reported on {formatDate(dispute.created_at)}
                    </span>
                  </div>
                  <span className="text-xs text-mutedGray">
                    Reported by: <strong>{dispute.reporter?.display_name || "Community User"}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-forest-dark">
                    Reason: {dispute.reason}
                  </h3>
                  <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">
                    {dispute.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-surfaceBorder/80">
                  <DisputeResolutionClient dispute={dispute} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center text-xs text-mutedGray">
            No pending community disputes.
          </div>
        )}
      </div>
    </div>
  );
}

