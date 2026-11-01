"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { UserCheck, Shield, ChevronDown } from "lucide-react";
import { Profile } from "@/types/database";
import { switchUserAction } from "@/actions";

interface UserSwitcherProps {
  currentUser: Profile;
  allUsers: Profile[];
}

export function UserSwitcher({ currentUser, allUsers }: UserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSelectUser = (userId: string) => {
    startTransition(async () => {
      await switchUserAction(userId);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surfaceBorder bg-cream/60 hover:bg-white transition-all text-xs font-medium text-charcoal shadow-sm"
        title="Switch simulated profile for testing"
      >
        <span className="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-forest/20">
          {currentUser.avatar_url ? (
            <img 
              src={currentUser.avatar_url} 
              alt={currentUser.display_name} 
              className="aspect-square h-full w-full object-cover" 
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-forest text-[10px] text-white">
              {currentUser.display_name[0]}
            </span>
          )}
        </span>
        <span className="hidden sm:inline font-medium text-forest-dark truncate max-w-[100px]">
          {currentUser.display_name.split(" ")[0]}
        </span>
        {currentUser.role === "admin" && (
          <span className="bg-forest text-white text-[10px] px-1.5 py-0.2 rounded font-semibold">
            Admin
          </span>
        )}
        <ChevronDown className="h-3 w-3 text-mutedGray" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-surfaceBorder p-2 z-50 animate-in fade-in zoom-in-95"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-2 border-b border-surfaceBorder/60 mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mutedGray">
              Switch Test Account
            </p>
            <p className="text-xs text-charcoal/80">
              Instantly test borrower, owner, or admin workflows
            </p>
          </div>
          <div className="space-y-1">
            {allUsers.map((user) => (
              <button
                key={user.id}
                disabled={isPending}
                onClick={() => handleSelectUser(user.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  user.id === currentUser.id 
                    ? "bg-forest-subtle text-forest font-semibold" 
                    : "hover:bg-cream text-charcoal"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={user.avatar_url || ""} 
                    alt={user.display_name} 
                    className="h-6 w-6 rounded-full object-cover border" 
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span>{user.display_name}</span>
                      {user.role === "admin" && (
                        <Shield className="h-3 w-3 text-accentOrange" />
                      )}
                    </div>
                    <span className="text-[10px] text-mutedGray">{user.city} · {user.role || "user"}</span>
                  </div>
                </div>
                {user.id === currentUser.id && (
                  <UserCheck className="h-4 w-4 text-forest" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
