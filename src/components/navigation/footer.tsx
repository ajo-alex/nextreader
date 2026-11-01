import Link from "next/link";
import { BookOpen, Heart, ShieldCheck, RefreshCw, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-surfaceBorder bg-[#F4F0E6] text-charcoal pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-surfaceBorder/80">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white shadow-sm">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-forest-dark">
                NextReader
              </span>
            </Link>
            <p className="font-serif text-lg text-forest-dark italic">
              "Every book deserves another reader."
            </p>
            <p className="text-sm text-mutedGray max-w-sm leading-relaxed">
              A community-powered platform connecting people who own physical books with readers nearby. Lend, borrow, exchange, and rent books with trust.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-forest font-medium">
              <span className="flex items-center gap-1 bg-sage/60 px-2.5 py-1 rounded-md">
                <ShieldCheck className="h-3.5 w-3.5 text-forest" /> Verified Readers
              </span>
              <span className="flex items-center gap-1 bg-sage/60 px-2.5 py-1 rounded-md">
                <RefreshCw className="h-3.5 w-3.5 text-forest" /> Zero Waste
              </span>
            </div>
          </div>

          {/* Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-mutedGray">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/discover" className="text-charcoal/80 hover:text-forest transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/discover?lending_type=free" className="text-charcoal/80 hover:text-forest transition-colors">
                  Free Community Lending
                </Link>
              </li>
              <li>
                <Link href="/discover?lending_type=rental" className="text-charcoal/80 hover:text-forest transition-colors">
                  Affordable Rentals
                </Link>
              </li>
              <li>
                <Link href="/discover?lending_type=exchange" className="text-charcoal/80 hover:text-forest transition-colors">
                  Book Exchanges
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-charcoal/80 hover:text-forest transition-colors">
                  Looking For This Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-mutedGray">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-charcoal/80 hover:text-forest transition-colors">
                  How NextReader Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-charcoal/80 hover:text-forest transition-colors">
                  Our Mission & Story
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-charcoal/80 hover:text-forest transition-colors">
                  Neighbourhood Hubs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-charcoal/80 hover:text-forest transition-colors">
                  Reader Dashboard
                </Link>
              </li>
              <li>
                <Link href="/books/new" className="text-charcoal/80 hover:text-forest transition-colors">
                  Share Your Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-mutedGray">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-charcoal/80 hover:text-forest transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-charcoal/80 hover:text-forest transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#trust" className="text-charcoal/80 hover:text-forest transition-colors">
                  Lending Code & Trust
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-charcoal/80 hover:text-forest transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-mutedGray gap-4">
          <p>
            © {new Date().getFullYear()} NextReader. Read it. Share it. Pass it on. Built for sustainable readers.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-forest" /> Active in Kochi, Bengaluru, Mumbai & Delhi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
