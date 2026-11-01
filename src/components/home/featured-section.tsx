"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Repeat, ShieldCheck } from "lucide-react";
import { Book } from "@/types/database";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";

interface FeaturedSectionProps {
  books: Book[];
  wishlistBookIds?: string[];
}

export function FeaturedSection({ books, wishlistBookIds = [] }: FeaturedSectionProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredBooks = books.filter((b) => {
    if (filter === "free") return b.lending_type === "free";
    if (filter === "rental") return b.lending_type === "rental";
    if (filter === "exchange") return b.lending_type === "exchange";
    return true;
  }).slice(0, 8);

  const wishlistSet = new Set(wishlistBookIds);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-forest-dark text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Community Bookshelf
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark tracking-tight">
            Featured in Your Community
          </h2>
          <p className="text-mutedGray text-sm sm:text-base mt-2 max-w-xl">
            Real physical books shared by fellow readers nearby. Borrow for free, rent affordably, or propose an exchange.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Formats" },
            { id: "free", label: "Free Lending" },
            { id: "rental", label: "Paid Rentals" },
            { id: "exchange", label: "Exchanges" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? "bg-forest text-white shadow-sm"
                  : "bg-white text-charcoal border border-surfaceBorder hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorited={wishlistSet.has(book.id)}
          />
        ))}
      </div>

      {/* Explore More CTA */}
      <div className="mt-12 text-center">
        <Link href="/discover">
          <Button variant="outline" size="lg" className="border-forest text-forest hover:bg-forest hover:text-white group">
            <span>Explore All Available Books</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

