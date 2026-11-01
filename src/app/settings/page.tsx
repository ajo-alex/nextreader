import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { revalidatePath } from "next/cache";
import { Settings, Shield, Bell, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const currentUser = await repository.getCurrentUser();

  async function updateSettingsAction(formData: FormData) {
    "use server";
    const displayName = formData.get("display_name") as string;
    const bio = formData.get("bio") as string;
    const city = formData.get("city") as string;
    const locality = formData.get("locality") as string;

    await repository.updateProfile(currentUser.id, {
      display_name: displayName,
      bio,
      city,
      locality,
    });

    revalidatePath("/profile");
    revalidatePath("/settings");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Settings className="h-7 w-7 text-forest" />
            Account & Profile Settings
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Manage your personal profile, privacy settings, and notification preferences.
          </p>
        </div>

        {/* Profile Settings Form */}
        <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-serif text-lg font-bold text-forest-dark border-b border-surfaceBorder pb-3">
            Public Profile Information
          </h3>

          <form action={updateSettingsAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Display Name
                </label>
                <Input
                  type="text"
                  name="display_name"
                  defaultValue={currentUser.display_name}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Username
                </label>
                <Input
                  type="text"
                  disabled
                  defaultValue={currentUser.username}
                  className="bg-cream-dark cursor-not-allowed"
                />
                <span className="text-[10px] text-mutedGray">Usernames cannot be changed.</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal">
                Short Bio
              </label>
              <Textarea
                name="bio"
                rows={3}
                defaultValue={currentUser.bio || ""}
                placeholder="Share your reading interests and favorite genres..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  defaultValue={currentUser.city}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal">
                  Locality / Neighbourhood
                </label>
                <Input
                  type="text"
                  name="locality"
                  defaultValue={currentUser.locality}
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="sm" className="px-6">
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Privacy & Trust Options */}
        <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-8 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-forest-dark flex items-center gap-2">
            <Shield className="h-5 w-5 text-forest" />
            Privacy & Trust Controls
          </h3>
          <p className="text-mutedGray">
            NextReader takes reader security seriously. Your exact residential address is never made public. Only approximate localities (e.g. "Kakkanad, Kochi") are shown on book listings.
          </p>

          <div className="pt-3 border-t border-surfaceBorder/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">Email Visibility</span>
                <span className="text-mutedGray text-[11px]">Keep your email hidden from other users.</span>
              </div>
              <span className="text-forest font-bold text-xs bg-sage px-2 py-0.5 rounded">Enabled</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">Exact Address Masking</span>
                <span className="text-mutedGray text-[11px]">Only share pickup points once loan request is confirmed.</span>
              </div>
              <span className="text-forest font-bold text-xs bg-sage px-2 py-0.5 rounded">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

