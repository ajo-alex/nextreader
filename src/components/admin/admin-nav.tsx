"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, Users, BookOpen, Clock, AlertTriangle, 
  Receipt, Sliders, ArrowLeft, BarChart3 
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/books", label: "Book Moderation", icon: BookOpen },
    { href: "/admin/loans", label: "Loan Monitoring", icon: Clock },
    { href: "/admin/reports", label: "Disputes & Reports", icon: AlertTriangle },
    { href: "/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/admin/settings", label: "Platform Rules", icon: Sliders },
  ];

  return (
    <div className="border-b border-surfaceBorder bg-forest-dark text-white sticky top-16 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-accentOrange text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Admin Ops
            </span>
            <span className="text-sage text-[11px]">
              Platform governance & trust verification console
            </span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sage hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>

        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 text-xs font-medium">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  active
                    ? "bg-white text-forest-dark font-bold shadow-xs"
                    : "text-sage/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

