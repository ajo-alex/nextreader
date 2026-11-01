"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookMarked, BookOpen, HeartHandshake, 
  Inbox, Heart, MessageSquare, Bell, User, Settings
} from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/my-books", label: "My Books", icon: BookMarked },
    { href: "/my-loans", label: "Borrowed", icon: BookOpen },
    { href: "/my-lending", label: "Lent Out", icon: HeartHandshake },
    { href: "/requests", label: "Requests", icon: Inbox },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="border-b border-surfaceBorder bg-white sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar text-xs font-medium">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  active
                    ? "bg-forest text-white font-semibold shadow-xs"
                    : "text-mutedGray hover:text-charcoal hover:bg-cream"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-mutedGray"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

