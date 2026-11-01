"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Check, CheckCheck, Bell, Clock, ArrowRight } from "lucide-react";
import { NotificationItem } from "@/types/database";
import { Button } from "@/components/ui/button";
import { markNotificationAsReadAction, markAllNotificationsAsReadAction } from "@/actions";
import { formatRelativeTime } from "@/lib/utils";

interface NotificationsClientProps {
  notifications: NotificationItem[];
}

export function NotificationsClient({ notifications }: NotificationsClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsReadAction(id);
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsReadAction();
    });
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-4 text-left">
      {/* Action Bar */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs text-mutedGray">
          {unreadCount > 0 ? `${unreadCount} unread notification(s)` : "All caught up!"}
        </span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleMarkAllRead}
            className="text-xs gap-1 text-forest hover:bg-forest/10"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="rounded-3xl border border-surfaceBorder bg-white overflow-hidden shadow-xs divide-y divide-surfaceBorder">
          {notifications.map((notif) => {
            const isUnread = !notif.read_at;
            return (
              <div
                key={notif.id}
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                  isUnread ? "bg-forest-subtle/40" : "hover:bg-cream/40"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUnread ? "bg-forest text-white" : "bg-cream-dark text-mutedGray"
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-forest-dark">
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-accentOrange shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-charcoal/80 leading-relaxed">
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-mutedGray block">
                      {formatRelativeTime(notif.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.link_url && (
                    <Link href={notif.link_url}>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1">
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-mutedGray hover:text-forest hover:bg-cream transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center text-xs text-mutedGray">
          No notifications to display.
        </div>
      )}
    </div>
  );
}
