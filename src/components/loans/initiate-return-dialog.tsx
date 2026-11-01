"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { initiateReturnAction } from "@/actions";
import { Loan } from "@/types/database";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface InitiateReturnDialogProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
}

export function InitiateReturnDialog({ loan, isOpen, onClose }: InitiateReturnDialogProps) {
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await initiateReturnAction(loan.id, notes);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Initiate Return for "{loan.book?.title}"</DialogTitle>
        <DialogDescription>
          Coordinate handover back to {loan.owner?.display_name}.
        </DialogDescription>
      </DialogHeader>

      {success ? (
        <div className="py-6 text-center space-y-2">
          <CheckCircle2 className="h-10 w-10 text-forest mx-auto" />
          <h4 className="font-serif font-bold text-base text-forest-dark">
            Return Initiated!
          </h4>
          <p className="text-xs text-mutedGray">
            The owner has been notified to inspect and confirm receipt.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal block">
              Condition & Handover Notes (Optional):
            </label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Left book at reception desk or returned in spotless condition near metro..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isPending}>
              {isPending ? "Submitting..." : "Confirm Return Initiated"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
