"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { respondLoanRequestAction, respondExchangeProposalAction } from "@/actions";

interface RequestActionsClientProps {
  requestId: string;
  type: "loan" | "exchange";
}

export function RequestActionsClient({ requestId, type }: RequestActionsClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: "accept" | "reject") => {
    startTransition(async () => {
      if (type === "loan") {
        await respondLoanRequestAction(requestId, action);
      } else {
        await respondExchangeProposalAction(requestId, action);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="primary"
        disabled={isPending}
        onClick={() => handleAction("accept")}
        className="h-8 px-3 text-xs gap-1"
      >
        <Check className="h-3.5 w-3.5" />
        {isPending ? "Accepting..." : "Accept"}
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => handleAction("reject")}
        className="h-8 px-3 text-xs gap-1 text-destructive hover:bg-destructive/10 border-destructive/20"
      >
        <X className="h-3.5 w-3.5" />
        {isPending ? "Rejecting..." : "Decline"}
      </Button>
    </div>
  );
}
