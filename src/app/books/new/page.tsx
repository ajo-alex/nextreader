"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookPlus, Sparkles, Upload, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBookAction } from "@/actions";

export default function NewBookPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [edition, setEdition] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [language, setLanguage] = useState("Malayalam");
  const [genre, setGenre] = useState("Literary Fiction");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80");
  const [condition, setCondition] = useState("very_good");
  const [lendingType, setLendingType] = useState("free");
  const [rentalPrice, setRentalPrice] = useState("0");
  const [securityDeposit, setSecurityDeposit] = useState("0");
  const [durationDays, setDurationDays] = useState("14");
  const [city, setCity] = useState("Kochi");
  const [locality, setLocality] = useState("Kakkanad");

  // ISBN Lookup simulation / Open Library integration
  const [isLookingUp, setIsLookingUp] = useState(false);
  const handleIsbnLookup = async () => {
    if (!isbn.trim()) return;
    setIsLookingUp(true);
    try {
      // Clean ISBN
      const cleanIsbn = isbn.replace(/[-\s]/g, "");
      // Sample bibliographic prefill based on known ISBN or Open Library
      if (cleanIsbn === "9788126421946") {
        setTitle("Aadujeevitham (ആടുജീവിതം)");
        setAuthor("Benyamin");
        setLanguage("Malayalam");
        setGenre("Literary Fiction");
        setPublisher("DC Books");
      } else if (cleanIsbn === "9780593135204") {
        setTitle("Project Hail Mary");
        setAuthor("Andy Weir");
        setLanguage("English");
        setGenre("Sci-Fi");
        setPublisher("Ballantine Books");
      } else {
        // Fallback default message
        setDescription((prev) => prev || `Hardcover copy of ISBN ${cleanIsbn}. Read once and kept on shelf.`);
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("author", author);
    formData.set("isbn", isbn);
    formData.set("publisher", publisher);
    formData.set("edition", edition);
    if (publicationYear) formData.set("publication_year", publicationYear);
    formData.set("language", language);
    formData.set("genre", genre);
    formData.set("description", description);
    formData.set("cover_image_url", coverImageUrl);
    formData.set("condition", condition);
    formData.set("lending_type", lendingType);
    formData.set("rental_price", rentalPrice);
    formData.set("security_deposit", securityDeposit);
    formData.set("lending_duration_days", durationDays);
    formData.set("city", city);
    formData.set("locality", locality);

    startTransition(async () => {
      const res = await createBookAction(formData);
      if (res.success && res.data) {
        router.push(`/books/${res.data.id}`);
      } else {
        setError(res.error || "Failed to create book listing");
      }
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/my-books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mutedGray hover:text-forest transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to My Books</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-10 shadow-sm text-left">
        {/* Header */}
        <div className="mb-8 border-b border-surfaceBorder/80 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-forest-dark text-xs font-semibold uppercase tracking-wider mb-2">
            <BookPlus className="h-3.5 w-3.5" /> List a Book
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark">
            Share a Book from Your Shelf
          </h1>
          <p className="text-sm text-mutedGray mt-1">
            Fill in the book details and your lending preferences. You retain full ownership.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Bibliographic Information */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              1. Book Details
            </h3>

            {/* ISBN Lookup bar */}
            <div className="flex gap-2 items-center bg-cream/40 p-3 rounded-xl border border-surfaceBorder">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-mutedGray block mb-1">
                  ISBN (Optional — Lookup Book Info)
                </label>
                <Input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="e.g. 9788126421946"
                  className="h-9 text-xs"
                />
              </div>
              <Button
                type="button"
                onClick={handleIsbnLookup}
                disabled={isLookingUp || !isbn}
                variant="outline"
                size="sm"
                className="mt-5 h-9 gap-1 text-xs"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{isLookingUp ? "Looking up..." : "Lookup"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Book Title <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aadujeevitham or Project Hail Mary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Author <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Benyamin or Andy Weir"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Language <span className="text-destructive">*</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-sm text-charcoal focus:ring-1 focus:ring-forest cursor-pointer"
                >
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Genre <span className="text-destructive">*</span>
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-sm text-charcoal focus:ring-1 focus:ring-forest cursor-pointer"
                >
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Publication Year
                </label>
                <Input
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                  placeholder="e.g. 2021"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal">
                Description & Notes <span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the edition, what the book meant to you, notes or highlights..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal">
                Cover Photo URL <span className="text-destructive">*</span>
              </label>
              <Input
                type="url"
                required
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
              />
              <p className="text-[11px] text-mutedGray">
                Paste an image URL or choose a placeholder photo of physical book covers.
              </p>
            </div>
          </div>

          {/* Section 2: Condition & Lending Rules */}
          <div className="space-y-4 pt-4 border-t border-surfaceBorder">
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              2. Condition & Lending Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Book Condition <span className="text-destructive">*</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-sm text-charcoal focus:ring-1 focus:ring-forest cursor-pointer"
                >
                  <option value="like_new">Like New (Unread or immaculate)</option>
                  <option value="very_good">Very Good (Minimal reading signs)</option>
                  <option value="good">Good (Clean text, intact cover)</option>
                  <option value="acceptable">Acceptable (Readable wear)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Lending Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={lendingType}
                  onChange={(e) => setLendingType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-sm text-charcoal focus:ring-1 focus:ring-forest cursor-pointer"
                >
                  <option value="free">Free Community Lending</option>
                  <option value="rental">Paid Rental</option>
                  <option value="exchange">Book Exchange Only</option>
                </select>
              </div>
            </div>

            {/* Paid Rental Specific Fields */}
            {lendingType === "rental" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-accentOrange-light/50 border border-accentOrange/20">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal">
                    Rental Fee (₹ INR) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(e.target.value)}
                    placeholder="e.g. 40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal">
                    Refundable Security Deposit (₹ INR)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    placeholder="e.g. 150"
                  />
                  <p className="text-[10px] text-mutedGray">
                    Held securely and refunded to borrower upon return.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Lending Duration (Days)
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-sm text-charcoal focus:ring-1 focus:ring-forest cursor-pointer"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days (Recommended)</option>
                  <option value="21">21 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  City <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kochi"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Locality / Neighbourhood <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Kakkanad or Indiranagar"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-surfaceBorder flex items-center justify-end gap-3">
            <Link href="/my-books">
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" disabled={isPending} className="px-6">
              {isPending ? "Creating Listing..." : "Publish Book Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
