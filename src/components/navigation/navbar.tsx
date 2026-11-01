"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, PlusCircle, Search, Bell, Heart, 
  Menu, X, Shield, LayoutDashboard, MessageSquare, BookMarked
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSwitcher } from "./user-switcher";
import { Profile } from "@/types/database";

interface NavbarProps {
  currentUser: Profile;
  allUsers: Profile[];
  unreadNotificationCount?: number;
}

export function Navbar({ currentUser, allUsers, unreadNotificationCount = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/discover", label: "Discover Books" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surfaceBorder bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white transition-transform group-hover:scale-105 shadow-sm">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-forest-dark">
                NextReader
              </span>
              <span className="text-[10px] tracking-wide text-mutedGray uppercase font-medium -mt-1 hidden sm:block">
                Read · Share · Pass On
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-forest font-semibold"
                    : "text-charcoal/80 hover:text-forest"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <Link
            href="/discover"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surfaceBorder bg-cream/50 text-mutedGray hover:text-charcoal text-xs transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search books, authors...</span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-mutedGray shadow-sm border">
              /
            </kbd>
          </Link>

          {/* List a Book CTA */}
          <Link href="/books/new" className="hidden sm:inline-flex">
            <Button size="sm" variant="accent" className="font-medium gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>Share a Book</span>
            </Button>
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="p-2 rounded-lg text-charcoal hover:bg-cream hover:text-forest transition-colors relative"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Notifications Icon with Badge */}
          <Link
            href="/notifications"
            className="p-2 rounded-lg text-charcoal hover:bg-cream hover:text-forest transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accentOrange text-[10px] font-bold text-white ring-2 ring-white">
                {unreadNotificationCount}
              </span>
            )}
          </Link>

          {/* Dashboard Icon */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg text-charcoal hover:bg-cream hover:text-forest transition-colors text-xs font-medium"
            title="User Dashboard"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden xl:inline">Dashboard</span>
          </Link>

          {/* Admin link if admin */}
          {currentUser.role === "admin" && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest/10 text-forest hover:bg-forest/20 text-xs font-semibold"
              title="Admin Panel"
            >
              <Shield className="h-3.5 w-3.5 text-forest" />
              <span>Admin</span>
            </Link>
          )}

          {/* Test User Switcher */}
          <UserSwitcher currentUser={currentUser} allUsers={allUsers} />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-charcoal hover:bg-cream"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surfaceBorder bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-forest-subtle text-forest font-semibold"
                    : "text-charcoal hover:bg-cream"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-surfaceBorder grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-cream hover:bg-cream-dark text-charcoal font-medium"
            >
              <LayoutDashboard className="h-4 w-4 text-forest" />
              Dashboard
            </Link>
            <Link
              href="/my-books"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-cream hover:bg-cream-dark text-charcoal font-medium"
            >
              <BookMarked className="h-4 w-4 text-forest" />
              My Books
            </Link>
            <Link
              href="/my-loans"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-cream hover:bg-cream-dark text-charcoal font-medium"
            >
              <BookOpen className="h-4 w-4 text-forest" />
              My Loans
            </Link>
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-cream hover:bg-cream-dark text-charcoal font-medium"
            >
              <MessageSquare className="h-4 w-4 text-forest" />
              Messages
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/books/new" onClick={() => setMobileMenuOpen(false)} className="w-full block">
              <Button variant="accent" className="w-full gap-2 font-medium">
                <PlusCircle className="h-4 w-4" />
                List Your Book
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
