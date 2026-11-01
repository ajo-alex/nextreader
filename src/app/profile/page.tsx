import Link from "next/link";
import { Star, MapPin, Calendar, BookOpen, ShieldCheck, HeartHandshake, Edit3 } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const currentUser = await repository.getCurrentUser();
  const [myBooks, myBorrowedLoans, myLentLoans, reviews] = await Promise.all([
    repository.getBooks({ ownerId: currentUser.id }),
    repository.getLoans({ userId: currentUser.id, asBorrower: true }),
    repository.getLoans({ userId: currentUser.id, asOwner: true }),
    repository.getReviewsForUser(currentUser.id),
  ]);

  const completedBorrowed = myBorrowedLoans.filter((l) => l.status === "returned").length;
  const completedLent = myLentLoans.filter((l) => l.status === "returned").length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 text-left">
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser.display_name}
                className="h-20 w-20 rounded-full object-cover border-2 border-forest/20 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
                    {currentUser.display_name}
                  </h1>
                  <span className="bg-sage text-forest-dark text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-forest-dark" />
                    {currentUser.reputation_score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-mutedGray">@{currentUser.username}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-mutedGray pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-forest" />
                    {currentUser.locality}, {currentUser.city}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {formatDate(currentUser.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/settings">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>

          {currentUser.bio && (
            <p className="text-sm text-charcoal/80 leading-relaxed bg-cream/50 p-4 rounded-2xl border border-surfaceBorder/60">
              "{currentUser.bio}"
            </p>
          )}

          {/* Activity Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-surfaceBorder text-center">
            <div className="p-3 rounded-2xl bg-cream/30">
              <span className="text-2xl font-serif font-bold text-forest-dark block">
                {myBooks.length}
              </span>
              <span className="text-xs text-mutedGray">Books Listed</span>
            </div>
            <div className="p-3 rounded-2xl bg-cream/30">
              <span className="text-2xl font-serif font-bold text-forest-dark block">
                {completedLent}
              </span>
              <span className="text-xs text-mutedGray">Completed Lendings</span>
            </div>
            <div className="p-3 rounded-2xl bg-cream/30">
              <span className="text-2xl font-serif font-bold text-forest-dark block">
                {completedBorrowed}
              </span>
              <span className="text-xs text-mutedGray">Completed Borrowings</span>
            </div>
          </div>
        </div>

        {/* Preferences & Reading Genres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Preferred Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.preferred_languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-full bg-cream text-charcoal text-xs font-medium border border-surfaceBorder"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Favourite Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.preferred_genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-forest-subtle text-forest text-xs font-semibold"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Community Reviews Received */}
        <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-forest-dark">
              Verified Reader Reviews ({reviews.length})
            </h3>
            <span className="text-xs text-mutedGray flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-forest" />
              Verified Transaction Feedback
            </span>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3 divide-y divide-surfaceBorder">
              {reviews.map((rev) => (
                <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-charcoal">
                        {rev.reviewer?.display_name || "Community Reader"}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accentOrange text-accentOrange" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-mutedGray">
                      {formatDate(rev.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-mutedGray italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-mutedGray">
              No reviews yet. Complete your first borrowing or lending to build verified community feedback!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
