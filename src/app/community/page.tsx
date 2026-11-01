import { repository } from "@/lib/data/repository";
import { WantedBookForm } from "@/components/community/wanted-book-form";
import { Users, MapPin, Sparkles, BookOpen, Clock, HeartHandshake } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const wantedRequests = await repository.getWantedRequests();

  const hubs = [
    {
      city: "Kochi, Kerala",
      localities: "Kakkanad · Fort Kochi · Palarivattom · Edappally",
      activeReaders: "140+ Readers",
      tagline: "Vibrant Malayalam modernism & translated world literature",
    },
    {
      city: "Bengaluru, Karnataka",
      localities: "Indiranagar · Koramangala · HSR Layout",
      activeReaders: "210+ Readers",
      tagline: "Software architecture, product theory & science fiction",
    },
    {
      city: "Delhi NCR",
      localities: "Connaught Place · Hauz Khas · South Extension",
      activeReaders: "95+ Readers",
      tagline: "Indian history, political memoirs & postcolonial essays",
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12 text-left">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest bg-sage px-3 py-1 rounded-full">
          Neighbourhood Hubs & Requests
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark mt-2">
          Community Reading Circles
        </h1>
        <p className="text-sm text-mutedGray mt-1 max-w-2xl leading-relaxed">
          Connect with readers in your city, see books neighbours are actively hunting for, or respond if you own a matching copy.
        </p>
      </div>

      {/* Community Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hubs.map((hub) => (
          <div
            key={hub.city}
            className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-bold text-forest">
                  <MapPin className="h-3.5 w-3.5" />
                  {hub.city}
                </span>
                <span className="bg-sage text-forest-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {hub.activeReaders}
                </span>
              </div>
              <p className="text-xs font-medium text-charcoal">{hub.localities}</p>
              <p className="text-xs text-mutedGray italic">"{hub.tagline}"</p>
            </div>

            <div className="pt-3 border-t border-surfaceBorder/60">
              <Link href={`/discover?city=${hub.city.split(",")[0]}`}>
                <Button variant="ghost" size="sm" className="w-full text-xs text-forest hover:bg-forest-subtle">
                  Browse {hub.city.split(",")[0]} Books →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Looking For This Book Board */}
      <div className="space-y-6 pt-4 border-t border-surfaceBorder">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-forest-dark flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accentOrange" />
              Looking For This Book
            </h2>
            <p className="text-xs text-mutedGray mt-0.5">
              Books readers are eager to find nearby. If you have any on your shelf, consider listing them!
            </p>
          </div>

          <WantedBookForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wantedRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-surfaceBorder bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-mutedGray">
                  <span className="bg-cream-dark px-2 py-0.5 rounded font-semibold text-charcoal">
                    {req.language}
                  </span>
                  <span>{formatDate(req.created_at)}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-forest-dark">
                  {req.title}
                </h3>
                <p className="text-xs text-mutedGray">by {req.author}</p>

                {req.note && (
                  <p className="text-xs text-charcoal/80 bg-cream/50 p-2.5 rounded-xl border border-surfaceBorder/60 mt-2 italic">
                    "{req.note}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-surfaceBorder/60 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-mutedGray text-[11px]">
                  <MapPin className="h-3 w-3 text-forest" />
                  {req.locality}, {req.city}
                </span>

                <Link href="/books/new">
                  <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
                    I Have This Book
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

