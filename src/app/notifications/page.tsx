import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { NotificationsClient } from "@/components/notifications/notifications-client";
import { Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const currentUser = await repository.getCurrentUser();
  const notifications = await repository.getUserNotifications(currentUser.id);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Bell className="h-7 w-7 text-forest" />
            Notifications
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Realtime alerts regarding your book requests, loans, return reminders, and reviews.
          </p>
        </div>

        <NotificationsClient notifications={notifications} />
      </div>
    </div>
  );
}
