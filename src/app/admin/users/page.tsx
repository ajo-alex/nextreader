import { repository } from "@/lib/data/repository";
import { AdminNav } from "@/components/admin/admin-nav";
import { Users, Star, Shield, MapPin, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await repository.getCurrentUser();
  if (currentUser.role !== "admin") {
    return <div className="p-8 text-center text-sm">Access denied. Admin role required.</div>;
  }

  const allUsers = await repository.getAllUsers();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark flex items-center gap-2">
            <Users className="h-7 w-7 text-forest" />
            User & Reader Management
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Overview of verified readers, trust reputation scores, and assigned platform roles.
          </p>
        </div>

        <div className="rounded-3xl border border-surfaceBorder bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-surfaceBorder uppercase text-[10px] text-mutedGray font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Reputation</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Languages</th>
                  <th className="px-6 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder">
                {allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || ""}
                          alt={user.display_name}
                          className="h-9 w-9 rounded-full object-cover border"
                        />
                        <div>
                          <span className="font-bold text-forest-dark block">
                            {user.display_name}
                          </span>
                          <span className="text-[11px] text-mutedGray">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {user.locality}, {user.city}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-charcoal bg-cream-dark px-2 py-0.5 rounded">
                        <Star className="h-3 w-3 fill-accentOrange text-accentOrange" />
                        {user.reputation_score ? user.reputation_score.toFixed(1) : "5.0"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "admin" ? "bg-forest text-white" : "bg-cream text-charcoal border"
                      }`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {user.preferred_languages.join(", ")}
                    </td>
                    <td className="px-6 py-4 text-mutedGray">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

