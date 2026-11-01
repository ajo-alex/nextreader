import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { Receipt, CreditCard, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  const currentUser = await repository.getCurrentUser();
  if (currentUser.role !== "admin") {
    return <div className="p-8 text-center text-sm">Access denied. Admin role required.</div>;
  }

  const payments = await repository.getPayments();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Receipt className="h-7 w-7 text-forest" />
            Financial & Payment Records ({payments.length})
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Audit rental fees, refundable security deposits, and platform commissions.
          </p>
        </div>

        <div className="rounded-3xl border border-surfaceBorder bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-surfaceBorder uppercase text-[10px] text-mutedGray font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Payment ID</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Rental Fee</th>
                  <th className="px-6 py-3.5">Deposit</th>
                  <th className="px-6 py-3.5">Platform Commission</th>
                  <th className="px-6 py-3.5">Provider / Mode</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] text-mutedGray">
                      {p.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-forest-dark">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-6 py-4 text-charcoal">
                      {formatCurrency(p.rental_fee)}
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {formatCurrency(p.security_deposit)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-accentOrange">
                      {formatCurrency(p.platform_commission)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-medium bg-cream px-2 py-0.5 rounded border">
                        {p.is_dev_mode ? "Dev Mode (Simulated)" : "Razorpay Live"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#E3F2E6] text-[#1B5E20] font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {formatDate(p.created_at)}
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

