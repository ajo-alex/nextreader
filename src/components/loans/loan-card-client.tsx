"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, RotateCcw, Star, AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";
import { Loan } from "@/types/database";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { InitiateReturnDialog } from "./initiate-return-dialog";
import { LeaveReviewDialog } from "./leave-review-dialog";

interface LoanCardClientProps {
  loan: Loan;
  isBorrower: boolean;
}

export function LoanCardClient({ loan, isBorrower }: LoanCardClientProps) {
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const isOverdue = loan.status === "overdue";
  const isReturnInitiated = loan.status === "return_initiated";
  const isReturned = loan.status === "returned";
  const isBorrowed = loan.status === "borrowed";

  return (
    <>
      <div className={`rounded-2xl border p-5 bg-white shadow-xs flex flex-col justify-between ${
        isOverdue ? "border-destructive/40 bg-destructive/5" : "border-surfaceBorder"
      }`}>
        <div className="flex gap-4">
          <img
            src={loan.book?.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"}
            alt={loan.book?.title || "Book"}
            className="h-28 w-20 object-cover rounded-xl border shrink-0 bg-cream-dark"
          />
          <div className="flex-1 min-w-0 space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isOverdue ? "bg-destructive text-white" :
                isReturnInitiated ? "bg-accentOrange-light text-[#A85A14]" :
                isReturned ? "bg-[#E3F2E6] text-[#1B5E20]" :
                "bg-sage text-forest-dark"
              }`}>
                {loan.status.replace("_", " ")}
              </span>
            </div>

            <Link href={`/books/${loan.book_id}`} className="font-serif font-bold text-base text-forest-dark hover:underline line-clamp-1 block">
              {loan.book?.title}
            </Link>

            <p className="text-xs text-mutedGray">
              {isBorrower ? (
                <>Owner: <span className="text-charcoal font-medium">{loan.owner?.display_name}</span> ({loan.owner?.locality})</>
              ) : (
                <>Borrower: <span className="text-charcoal font-medium">{loan.borrower?.display_name}</span> ({loan.borrower?.locality})</>
              )}
            </p>

            <div className="text-xs text-mutedGray space-y-0.5 pt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-forest" />
                <span>Due Date: <strong className={isOverdue ? "text-destructive" : "text-charcoal"}>{formatDate(loan.due_date)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="mt-4 pt-3 border-t border-surfaceBorder/60 flex items-center justify-between text-xs">
          <Link href="/messages" className="flex items-center gap-1 text-mutedGray hover:text-forest">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Borrower return action */}
            {isBorrower && (isBorrowed || isOverdue) && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => setReturnDialogOpen(true)}
                className="text-xs gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Initiate Return
              </Button>
            )}

            {/* Review action if returned */}
            {isReturned && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReviewDialogOpen(true)}
                className="text-xs gap-1 border-accentOrange text-accentOrange hover:bg-accentOrange-light"
              >
                <Star className="h-3.5 w-3.5" />
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </div>

      <InitiateReturnDialog
        loan={loan}
        isOpen={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
      />

      <LeaveReviewDialog
        transactionId={loan.id}
        revieweeId={loan.owner_id}
        revieweeName={loan.owner?.display_name || "Lender"}
        bookTitle={loan.book?.title || "Book"}
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      />
    </>
  );
}
