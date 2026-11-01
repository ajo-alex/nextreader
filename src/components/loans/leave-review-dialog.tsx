"use client";

import { useState, useTransition } from "react";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReviewAction } from "@/actions";

interface LeaveReviewDialogProps {
  transactionId: string;
  revieweeId: string;
  revieweeName: string;
  bookTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LeaveReviewDialog({
  transactionId,
  revieweeId,
  revieweeName,
  bookTitle,
  isOpen,
  onClose,
}: LeaveReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await submitReviewAction({
        transactionType: "loan",
        transactionId,
        revieweeId,
        rating,
        comment,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.error || "Failed to submit review");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Leave a Review for {revieweeName}</DialogTitle>
        <DialogDescription>
          Regarding your completed loan of "{bookTitle}".
        </DialogDescription>
      </DialogHeader>

      {success ? (
        <div className="py-6 text-center space-y-2">
          <CheckCircle2 className="h-10 w-10 text-forest mx-auto" />
          <h4 className="font-serif font-bold text-base text-forest-dark">
            Review Submitted!
          </h4>
          <p className="text-xs text-mutedGray">
            Thank you for building trust in the NextReader reading community.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Star selector */}
          <div className="space-y-1.5 text-center py-2">
            <label className="font-semibold text-charcoal block">Rating</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= rating
                        ? "fill-accentOrange text-accentOrange"
                        : "text-mutedGray/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] text-mutedGray">{rating} out of 5 stars</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal block">
              Your Feedback (Optional):
            </label>
            <Textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the handover smooth? Was the book in described condition?..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
