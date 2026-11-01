"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (city !== "All") params.set("city", city);
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl rounded-2xl bg-white p-2 sm:p-2.5 shadow-xl border border-surfaceBorder flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
    >
      <div className="flex flex-1 items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-surfaceBorder/80">
        <Search className="h-4 w-4 text-forest shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, author, or Malayalam literature..."
          className="w-full text-sm text-charcoal placeholder:text-mutedGray focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 min-w-[140px]">
        <MapPin className="h-4 w-4 text-accentOrange shrink-0" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full text-sm text-charcoal bg-transparent focus:outline-none cursor-pointer"
        >
          <option value="All">All Cities</option>
          <option value="Kochi">Kochi</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>

      <Button type="submit" variant="primary" className="h-11 sm:h-10 px-5 gap-1.5 shrink-0">
        <span>Find Books</span>
      </Button>
    </form>
  );
}

