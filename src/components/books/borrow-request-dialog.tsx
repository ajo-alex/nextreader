"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Book, Profile, LendingType 
} from "@/types/database";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { requestLoanAction, proposeExchangeAction, processPaymentAction } from "@/actions";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, AlertCircle, ArrowLeftRight, ShieldCheck, CreditCard } from "lucide-react";

interface BorrowRequestDialogProps {
  book: Book;
  currentUser: Profile;
  userOwnedBooks: Book[];
  isOpen: boolean;
  onClose: () => void;
}

export function BorrowRequestDialog({
  book,
  currentUser,
  userOwnedBooks,
  isOpen,
  onClose,
}: BorrowRequestDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [durationDays, setDurationDays] = useState(book.lending_duration_days || 14);
  const [message, setMessage] = useState("");
  const [offeredBookId, setOfferedBookId] = useState(userOwnedBooks[0]?.id || "");
  const [handoverNote, setHandoverNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calculations for Paid Rentals
  const rentalFee = book.rental_price || 0;
  const deposit = book.security_deposit || 0;
  const platformFee = Math.round(rentalFee * 0.1);
  const totalAmount = rentalFee + deposit + platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (book.lending_type === "exchange") {
          if (!offeredBookId) {
            setError("Please select a book from your bookshelf to offer in exchange.");
            return;
          }
          const res = await proposeExchangeAction({
            offeredBookId,
            requestedBookId: book.id,
            handoverArrangement: handoverNote,
            message,
          });
          if (!res.success) {
            setError(res.error || "Failed to propose exchange");
            return;
          }
        } else {
          // Free or Paid Rental Request
          const res = await requestLoanAction({
            bookId: book.id,
            durationDays,
            message,
          });

          if (!res.success) {
            setError(res.error || "Failed to submit request");
            return;
          }

          // If Paid Rental, create simulated payment record
          if (book.lending_type === "rental") {
            await processPaymentAction({
              loanId: (res.data as any)?.id,
              rentalFee,
              securityDeposit: deposit,
            });
          }
        }

        setSuccess(true);
        setTimeout(() => {
          onClose();
          router.push("/requests");
        }, 1200);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>
          {book.lending_type === "free" && `Request to Borrow "${book.title}"`}
          {book.lending_type === "rental" && `Rent "${book.title}"`}
          {book.lending_type === "exchange" && `Propose Book Exchange`}
        </DialogTitle>
        <DialogDescription>
          Owner: <span className="font-semibold text-charcoal">{book.owner?.display_name}</span> ({book.locality}, {book.city})
        </DialogDescription>
      </DialogHeader>

      {success ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-forest mx-auto animate-in zoom-in-50" />
          <h4 className="font-serif text-lg font-bold text-forest-dark">
            Request Sent Successfully!
          </h4>
          <p className="text-xs text-mutedGray">
            The owner has been notified. Redirecting to your requests tracker...
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

          {/* If Paid Rental: Transparent Price Breakdown */}
          {book.lending_type === "rental" && (
            <div className="rounded-xl border border-surfaceBorder bg-cream/50 p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold text-forest-dark">
                <span>Rental Fee ({durationDays} days):</span>
                <span>{formatCurrency(rentalFee)}</span>
              </div>
              {deposit > 0 && (
                <div className="flex items-center justify-between text-mutedGray">
                  <span>Refundable Security Deposit:</span>
                  <span>{formatCurrency(deposit)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-mutedGray">
                <span>Platform Commission (10%):</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <div className="pt-2 border-t border-surfaceBorder flex items-center justify-between font-bold text-sm text-forest-dark">
                <span>Total Amount:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-mutedGray">
                <CreditCard className="h-3.5 w-3.5 text-forest" />
                <span>Development Mode: Transparent simulated Razorpay payment. Deposit is refunded upon confirmed return.</span>
              </div>
            </div>
          )}

          {/* If Exchange: Select Offered Book */}
          {book.lending_type === "exchange" && (
            <div className="space-y-3">
              <label className="font-bold text-charcoal block">
                Select a book from your bookshelf to offer:
              </label>
              {userOwnedBooks.length > 0 ? (
                <select
                  value={offeredBookId}
                  onChange={(e) => setOfferedBookId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-surfaceBorder bg-white text-charcoal focus:ring-1 focus:ring-forest"
                  required
                >
                  {userOwnedBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} by {b.author} ({b.genre})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-lg bg-cream border text-mutedGray text-xs">
                  You don't have any books listed on your shelf yet. <a href="/books/new" className="text-forest font-bold underline">List a book</a> first to propose an exchange.
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-charcoal block">
                  Suggested meeting / handover spot:
                </label>
                <input
                  type="text"
                  value={handoverNote}
                  onChange={(e) => setHandoverNote(e.target.value)}
                  placeholder="e.g. Near Palarivattom Metro station or local cafe"
                  className="w-full p-2 rounded-lg border border-surfaceBorder text-charcoal text-xs"
                />
              </div>
            </div>
          )}

          {/* Duration Selector for Free or Rental */}
          {book.lending_type !== "exchange" && (
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal block">
                Requested Duration (Days):
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-surfaceBorder bg-white text-charcoal focus:ring-1 focus:ring-forest cursor-pointer"
              >
                <option value={7}>7 days (1 week)</option>
                <option value={14}>14 days (2 weeks - Recommended)</option>
                <option value={21}>21 days (3 weeks)</option>
                <option value={30}>30 days (1 month)</option>
              </select>
            </div>
          )}

          {/* Optional Message to Owner */}
          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal block">
              Message to Owner (Optional):
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'd love to read your copy. I treat books with great care..."
              className="w-full p-2.5 rounded-lg border border-surfaceBorder bg-white text-charcoal focus:ring-1 focus:ring-forest"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isPending}>
              {isPending ? "Submitting..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}

