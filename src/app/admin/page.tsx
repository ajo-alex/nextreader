import Link from "next/link";
import { 
  Users, BookOpen, Clock, AlertTriangle, Receipt, 
  ShieldCheck, TrendingUp, IndianRupee, ShieldAlert, ArrowRight 
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const currentUser = await repository.getCurrentUser();

  // Server-side Authorization Check
  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-3xl border border-surfaceBorder bg-white p-8 shadow-xl space-y-4">
          <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-dark">
            Administrative Access Restricted
          </h2>
          <p className="text-xs text-mutedGray leading-relaxed">
            You are currently signed in as <strong>{currentUser.display_name}</strong> (role: {currentUser.role || "user"}). Administrative routes require server authorization.
          </p>
          <div className="pt-2 border-t border-surfaceBorder space-y-2">
            <p className="text-[11px] text-mutedGray">
              For testing and demonstration, switch your active test profile to <strong>NextReader Team (Admin)</strong> using the switcher in the header.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metrics = await repository.getAdminMetrics();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark">
            Platform Operations & Metrics
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Real aggregate metrics, community dispute resolution, and transaction records.
          </p>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-mutedGray mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
              <Users className="h-4 w-4 text-forest" />
            </div>
            <p className="text-3xl font-serif font-bold text-forest-dark">
              {metrics.totalUsers}
            </p>
            <p className="text-[11px] text-mutedGray mt-1">
              Registered community readers
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-mutedGray mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Book Listings</span>
              <BookOpen className="h-4 w-4 text-forest" />
            </div>
            <p className="text-3xl font-serif font-bold text-forest-dark">
              {metrics.totalBooks}
            </p>
            <p className="text-[11px] text-mutedGray mt-1">
              {metrics.availableBooks} currently available
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-mutedGray mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Loans</span>
              <Clock className="h-4 w-4 text-forest" />
            </div>
            <p className="text-3xl font-serif font-bold text-forest-dark">
              {metrics.activeLoans}
            </p>
            <p className="text-[11px] text-mutedGray mt-1">
              {metrics.completedLoans} completed returns
            </p>
          </div>

          <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-mutedGray mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Platform Revenue</span>
              <TrendingUp className="h-4 w-4 text-accentOrange" />
            </div>
            <p className="text-3xl font-serif font-bold text-forest-dark">
              {formatCurrency(metrics.totalPlatformRevenue)}
            </p>
            <p className="text-[11px] text-mutedGray mt-1">
              From {formatCurrency(metrics.totalTransactionVolume)} volume
            </p>
          </div>
        </div>

        {/* Operational Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users" className="group">
            <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs hover:border-forest/50 transition-all space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-forest-subtle text-forest flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-dark">
                User Management
              </h3>
              <p className="text-xs text-mutedGray leading-relaxed">
                Inspect reader profiles, reputation summaries, role privileges, and account status.
              </p>
              <div className="pt-2 text-xs font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Manage Users</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          <Link href="/admin/books" className="group">
            <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs hover:border-forest/50 transition-all space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-forest-subtle text-forest flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-dark">
                Book Moderation
              </h3>
              <p className="text-xs text-mutedGray leading-relaxed">
                Search catalogue items, moderate inappropriate listings, and inspect physical book metadata.
              </p>
              <div className="pt-2 text-xs font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Moderate Books</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          <Link href="/admin/reports" className="group">
            <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs hover:border-forest/50 transition-all space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-accentOrange-light text-accentOrange flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-dark">
                Disputes & Reports ({metrics.pendingDisputes})
              </h3>
              <p className="text-xs text-mutedGray leading-relaxed">
                Review overdue disputes, condition damage claims, and approved deposit resolutions.
              </p>
              <div className="pt-2 text-xs font-semibold text-accentOrange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Review Disputes</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

