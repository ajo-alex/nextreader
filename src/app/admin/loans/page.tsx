import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLoansPage() {
  const currentUser = await repository.getCurrentUser();
  if (currentUser.role !== "admin") {
    return <div className="p-8 text-center text-sm">Access denied. Admin role required.</div>;
  }

  const allLoans = await repository.getLoans();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Clock className="h-7 w-7 text-forest" />
            Loan & Circulation Monitoring ({allLoans.length})
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Realtime audit of physical book loans across communities, return deadlines, and overdue states.
          </p>
        </div>

        <div className="rounded-3xl border border-surfaceBorder bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-surfaceBorder uppercase text-[10px] text-mutedGray font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Loan ID</th>
                  <th className="px-6 py-3.5">Book Title</th>
                  <th className="px-6 py-3.5">Lender</th>
                  <th className="px-6 py-3.5">Borrower</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder">
                {allLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] text-mutedGray">
                      {loan.id.slice(0, 13)}
                    </td>
                    <td className="px-6 py-4 font-bold text-forest-dark">
                      <Link href={`/books/${loan.book_id}`} className="hover:underline">
                        {loan.book?.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {loan.owner?.display_name} ({loan.owner?.locality})
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {loan.borrower?.display_name} ({loan.borrower?.locality})
                    </td>
                    <td className="px-6 py-4">
                      <span className={loan.status === "overdue" ? "text-destructive font-bold" : "text-charcoal"}>
                        {formatDate(loan.due_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        loan.status === "overdue" ? "bg-destructive text-white" :
                        loan.status === "returned" ? "bg-[#E3F2E6] text-[#1B5E20]" :
                        "bg-sage text-forest-dark"
                      }`}>
                        {loan.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
