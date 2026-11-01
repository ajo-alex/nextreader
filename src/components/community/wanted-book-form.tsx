"use client";

import { useState, useTransition } from "react";
import { PlusCircle, CheckCircle2, AlertCircle, BookPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWantedRequestAction } from "@/actions";

export function WantedBookForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("Malayalam");
  const [city, setCity] = useState("Kochi");
  const [locality, setLocality] = useState("Kakkanad");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("author", author);
    formData.set("language", language);
    formData.set("city", city);
    formData.set("locality", locality);
    formData.set("note", note);

    startTransition(async () => {
      const res = await createWantedRequestAction(formData);
      if (res.success) {
        setSuccess(true);
        setTitle("");
        setAuthor("");
        setNote("");
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
        }, 1500);
      } else {
        setError(res.error || "Failed to post request");
      }
    });
  };

  if (!isOpen) {
    return (
      <Button
        variant="accent"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 font-medium"
      >
        <PlusCircle className="h-4 w-4" />
        Post a Book You Are Looking For
      </Button>
    );
  }

  return (
    <div className="rounded-3xl border border-surfaceBorder bg-white p-6 shadow-xs text-left space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-serif font-bold text-base text-forest-dark flex items-center gap-2">
          <BookPlus className="h-5 w-5 text-forest" />
          Looking For This Book
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-mutedGray hover:text-charcoal"
        >
          Cancel
        </button>
      </div>

      {success ? (
        <div className="py-4 text-center text-xs text-forest font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Your book request is now posted on the community board!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Book Title *</label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kalam or The Three-Body Problem"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Author *</label>
              <Input
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. M. T. Vasudevan Nair"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-xs cursor-pointer"
              >
                <option value="Malayalam">Malayalam</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">City</label>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kochi"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Locality</label>
              <Input
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Kakkanad"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-charcoal">Note to community (Optional):</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Looking to borrow for reading circle, any edition is fine..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post to Community"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
