"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter, RotateCcw, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DiscoverFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "All");
  const [language, setLanguage] = useState(searchParams.get("language") || "All");
  const [lendingType, setLendingType] = useState(searchParams.get("lending_type") || "All");
  const [condition, setCondition] = useState(searchParams.get("condition") || "All");
  const [city, setCity] = useState(searchParams.get("city") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [isExpanded, setIsExpanded] = useState(false);

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (genre !== "All") params.set("genre", genre);
      if (language !== "All") params.set("language", language);
      if (lendingType !== "All") params.set("lending_type", lendingType);
      if (condition !== "All") params.set("condition", condition);
      if (city !== "All") params.set("city", city);
      if (sortBy !== "newest") params.set("sortBy", sortBy);

      router.push(`/discover?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearch("");
    setGenre("All");
    setLanguage("All");
    setLendingType("All");
    setCondition("All");
    setCity("All");
    setSortBy("newest");
    router.push("/discover");
  };

  return (
    <div className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-sm space-y-4 mb-8">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mutedGray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search by title, author, keyword or ISBN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surfaceBorder bg-cream/30 text-sm text-charcoal placeholder:text-mutedGray focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-all"
          />
        </div>

        {/* Lending Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "All", label: "All Types" },
            { id: "free", label: "Free Lending" },
            { id: "rental", label: "Rentals" },
            { id: "exchange", label: "Exchanges" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setLendingType(type.id);
                // quick apply
                const params = new URLSearchParams(searchParams.toString());
                if (type.id === "All") params.delete("lending_type");
                else params.set("lending_type", type.id);
                router.push(`/discover?${params.toString()}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                lendingType === type.id
                  ? "bg-forest text-white"
                  : "bg-cream text-charcoal hover:bg-cream-dark"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={applyFilters}
            disabled={isPending}
            variant="primary"
            size="sm"
            className="h-10 px-5"
          >
            Apply
          </Button>

          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
            className="h-10 gap-1.5"
            title="Toggle more filters"
          >
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </Button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg text-mutedGray hover:text-charcoal hover:bg-cream transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Filters Drawer */}
      {isExpanded && (
        <div className="pt-4 border-t border-surfaceBorder/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-200 text-xs">
          {/* Genre */}
          <div className="space-y-1.5">
            <label className="font-semibold text-mutedGray uppercase tracking-wider text-[10px]">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-2 rounded-lg border border-surfaceBorder bg-cream/40 text-charcoal focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
            >
              <option value="All">All Genres</option>
              <option value="Literary Fiction">Literary Fiction</option>
              <option value="Sci-Fi">Science Fiction</option>
              <option value="Classics">Classics</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Business">Business</option>
              <option value="Psychology">Psychology</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <label className="font-semibold text-mutedGray uppercase tracking-wider text-[10px]">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg border border-surfaceBorder bg-cream/40 text-charcoal focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Malayalam">Malayalam (മലയാളം)</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>

          {/* Location / City */}
          <div className="space-y-1.5">
            <label className="font-semibold text-mutedGray uppercase tracking-wider text-[10px]">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 rounded-lg border border-surfaceBorder bg-cream/40 text-charcoal focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
            >
              <option value="All">All Cities</option>
              <option value="Kochi">Kochi (Kakkanad, Fort Kochi, Palarivattom)</option>
              <option value="Bengaluru">Bengaluru (Indiranagar, Koramangala)</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="font-semibold text-mutedGray uppercase tracking-wider text-[10px]">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-lg border border-surfaceBorder bg-cream/40 text-charcoal focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
            >
              <option value="newest">Recently Listed</option>
              <option value="popular">Most Viewed</option>
              <option value="price_asc">Rental Fee: Low to High</option>
              <option value="price_desc">Rental Fee: High to Low</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

