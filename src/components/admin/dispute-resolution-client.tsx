"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { DisputeRecord } from "@/types/database";
import { Button } from "@/components/ui/button";
import { resolveDisputeAction } from "@/actions";

interface DisputeResolutionClientProps {
  dispute: DisputeRecord;
}

export function DisputeResolutionClient({ dispute }: DisputeResolutionClientProps) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNote.trim()) return;

    startTransition(async () => {
      await resolveDisputeAction(dispute.id, resolutionNote.trim());
      setIsOpen(false);
    });
  };

  if (dispute.status === "resolved") {
    return (
      <div className="text-xs text-forest font-semibold flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4" />
        <span>Resolved: {dispute.resolution}</span>
      </div>
    );
  }

  return (
    <div>
      {!isOpen ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="text-xs"
        >
          Resolve Dispute
        </Button>
      ) : (
        <form onSubmit={handleResolve} className="mt-2 space-y-2 text-xs">
          <input
            type="text"
            required
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="Enter administrative resolution..."
            className="w-full p-2 border rounded-lg bg-white text-xs"
          />
          <div className="flex gap-2">
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
              {isPending ? "Recording..." : "Save Resolution"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
