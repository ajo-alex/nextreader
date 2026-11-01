"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, AlertCircle, MessageSquare, Star } from "lucide-react";
import { Loan } from "@/types/database";
import { Button } from "@/components/ui/button";
import { confirmHandoverAction, confirmReturnAction, submitDisputeAction } from "@/actions";
import { LeaveReviewDialog } from "./leave-review-dialog";

interface LenderActionsClientProps {
  loan: Loan;
}

export function LenderActionsClient({ loan }: LenderActionsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  const handleConfirmHandover = () => {
    startTransition(async () => {
      await confirmHandoverAction(loan.id);
    });
  };

  const handleConfirmReturn = () => {
    startTransition(async () => {
      await confirmReturnAction(loan.id);
    });
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    startTransition(async () => {
      const res = await submitDisputeAction({
        transactionType: "loan",
        transactionId: loan.id,
        reason: disputeReason,
        description: `Owner reported issue for ${loan.book?.title} lent to ${loan.borrower?.display_name}`,
      });
      if (res.success) {
        setDisputeSuccess(true);
      }
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* If awaiting handover */}
        {loan.status === "awaiting_handover" && (
          <Button
            size="sm"
            variant="primary"
            disabled={isPending}
            onClick={handleConfirmHandover}
            className="text-xs gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isPending ? "Confirming..." : "Confirm Handover"}
          </Button>
        )}

        {/* If return initiated */}
        {loan.status === "return_initiated" && (
          <Button
            size="sm"
            variant="primary"
            disabled={isPending}
            onClick={handleConfirmReturn}
            className="text-xs gap-1.5 bg-[#1B5E20] hover:bg-[#154A19]"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isPending ? "Confirming..." : "Confirm Book Received & Close Loan"}
          </Button>
        )}

        {/* If returned */}
        {loan.status === "returned" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setReviewDialogOpen(true)}
            className="text-xs gap-1.5 text-accentOrange border-accentOrange hover:bg-accentOrange-light"
          >
            <Star className="h-3.5 w-3.5" />
            Review Borrower
          </Button>
        )}

        {/* Report issue toggle */}
        {["borrowed", "overdue", "return_initiated"].includes(loan.status) && (
          <button
            onClick={() => setDisputeOpen(!disputeOpen)}
            className="text-xs text-mutedGray hover:text-destructive underline ml-2"
          >
            Report an issue
          </button>
        )}
      </div>

      {/* Inline dispute form */}
      {disputeOpen && (
        <div className="mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs space-y-2">
          {disputeSuccess ? (
            <p className="text-forest-dark font-semibold">
              Issue reported to NextReader trust & dispute desk. Admin will inspect records.
            </p>
          ) : (
            <form onSubmit={handleReportIssue} className="space-y-2">
              <label className="font-semibold text-destructive block">
                Describe the issue (e.g. overdue without notice, damage):
              </label>
              <input
                type="text"
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="State the problem clearly..."
                className="w-full p-2 rounded-lg border bg-white text-xs"
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setDisputeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
                  {isPending ? "Filing..." : "Submit to Admin"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      <LeaveReviewDialog
        transactionId={loan.id}
        revieweeId={loan.borrower_id}
        revieweeName={loan.borrower?.display_name || "Borrower"}
        bookTitle={loan.book?.title || "Book"}
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      />
    </>
  );
}

