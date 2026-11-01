import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { Sliders, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const currentUser = await repository.getCurrentUser();
  if (currentUser.role !== "admin") {
    return <div className="p-8 text-center text-sm">Access denied. Admin role required.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Sliders className="h-7 w-7 text-forest" />
            Platform Rules & Policies
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Configure transaction commission fees, security deposit guidelines, and default lending limits.
          </p>
        </div>

        <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs">
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-forest-dark border-b pb-2">
              Commission & Payments
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal block">
                  Platform Commission Percentage (%)
                </label>
                <Input type="number" defaultValue="10" className="h-9" readOnly />
                <span className="text-[10px] text-mutedGray">
                  Configured via PLATFORM_COMMISSION_PERCENTAGE environment variable.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal block">
                  Payment Gateway Adapter
                </label>
                <Input type="text" defaultValue="Razorpay (INR)" className="h-9" readOnly />
                <span className="text-[10px] text-mutedGray">
                  Supports Indian Rupee UPI, Cards, and Netbanking.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-surfaceBorder">
            <h3 className="font-serif text-base font-bold text-forest-dark border-b pb-2">
              Security Deposit Policies
            </h3>

            <div className="space-y-2 text-mutedGray leading-relaxed">
              <p>
                • Security deposits are held securely throughout the loan period.
              </p>
              <p>
                • Deposit deductions require a transparent dispute resolution logged by authorized administrators.
              </p>
              <p>
                • Overdue books do not automatically forfeit deposits; owner and borrower must first be mediated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

