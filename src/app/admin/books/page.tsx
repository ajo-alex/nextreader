import Link from "next/link";
import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { BookOpen, Eye, MapPin, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const currentUser = await repository.getCurrentUser();
  if (currentUser.role !== "admin") {
    return <div className="p-8 text-center text-sm">Access denied. Admin role required.</div>;
  }

  const allBooks = await repository.getBooks();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-forest" />
            Book Listing Moderation ({allBooks.length})
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Audit physical book catalogue items, verify condition standards, and inspect owner listings.
          </p>
        </div>

        <div className="rounded-3xl border border-surfaceBorder bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-surfaceBorder uppercase text-[10px] text-mutedGray font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Book</th>
                  <th className="px-6 py-3.5">Owner</th>
                  <th className="px-6 py-3.5">Type & Price</th>
                  <th className="px-6 py-3.5">Condition</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder">
                {allBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className="h-12 w-8 object-cover rounded border bg-cream-dark shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-forest-dark block truncate">
                            {book.title}
                          </span>
                          <span className="text-[11px] text-mutedGray truncate block">
                            by {book.author} · {book.language}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {book.owner?.display_name} ({book.locality})
                    </td>
                    <td className="px-6 py-4">
                      {book.lending_type === "free" && (
                        <span className="bg-sage text-forest-dark font-semibold px-2 py-0.5 rounded text-[10px]">
                          Free Lending
                        </span>
                      )}
                      {book.lending_type === "rental" && (
                        <span className="bg-accentOrange-light text-[#A85A14] font-semibold px-2 py-0.5 rounded text-[10px]">
                          {formatCurrency(book.rental_price)} ({book.lending_duration_days}d)
                        </span>
                      )}
                      {book.lending_type === "exchange" && (
                        <span className="bg-[#E8EEF5] text-[#1E3A5F] font-semibold px-2 py-0.5 rounded text-[10px]">
                          Exchange
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize text-charcoal font-medium">
                      {book.condition.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        book.availability_status === "available" ? "bg-[#E3F2E6] text-[#1B5E20]" : "bg-cream text-mutedGray"
                      }`}>
                        {book.availability_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/books/${book.id}`}
                        className="text-forest hover:underline font-semibold"
                      >
                        Inspect Listing →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

