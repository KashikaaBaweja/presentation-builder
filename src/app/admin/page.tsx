import {
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminStats } from "@/lib/admin/stats";
import { formatDeckUpdatedAt } from "@/lib/decks/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatSignupDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  let loadError: string | null = null;
  let stats = {
    totalUsers: 0,
    totalPresentations: 0,
    activeUsers: 0,
    newUsersThisWeek: 0,
  };
  let recentPresentations: Awaited<
    ReturnType<typeof getAdminStats>
  >["presentations"] = [];
  let recentUsers: Awaited<ReturnType<typeof getAdminStats>>["users"] = [];

  try {
    const data = await getAdminStats(supabase);
    stats = data.stats;
    recentPresentations = data.presentations.slice(0, 5);
    recentUsers = [...data.users]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to load admin dashboard:", error);
    loadError = "Could not load dashboard data. Check profiles and admin RLS policies.";
  }

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of users, presentations, and recent activity across the platform."
      />

      {loadError && (
        <p className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {loadError}
        </p>
      )}

      {!loadError && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Total users" value={stats.totalUsers} />
            <AdminStatCard
              label="Presentations"
              value={stats.totalPresentations}
            />
            <AdminStatCard
              label="Active users"
              value={stats.activeUsers}
              hint="Users with at least one saved deck"
            />
            <AdminStatCard
              label="New this week"
              value={stats.newUsersThisWeek}
              hint="Signups in the last 7 days"
            />
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-2">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-ink">
                  Recent presentations
                </h2>
                <Link
                  href="/admin/presentations"
                  className="text-sm font-medium text-brand hover:underline"
                >
                  View all
                </Link>
              </div>
              {recentPresentations.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-muted-200 bg-white px-6 py-10 text-center text-sm text-muted-500">
                  No presentations yet.
                </p>
              ) : (
                <ul className="divide-y divide-muted-100 overflow-hidden rounded-2xl border border-muted-200 bg-white">
                  {recentPresentations.map((presentation) => (
                    <li key={presentation.id}>
                      <Link
                        href={`/editor?deck=${presentation.id}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">
                            {presentation.title?.trim() || "Untitled presentation"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-400">
                            {presentation.owner_email}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-400">
                          {formatDeckUpdatedAt(presentation.updated_at)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-ink">
                  Recent signups
                </h2>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-brand hover:underline"
                >
                  View all
                </Link>
              </div>
              {recentUsers.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-muted-200 bg-white px-6 py-10 text-center text-sm text-muted-500">
                  No users yet.
                </p>
              ) : (
                <ul className="divide-y divide-muted-100 overflow-hidden rounded-2xl border border-muted-200 bg-white">
                  {recentUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">
                          {user.email}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-400">
                          {user.deck_count} deck{user.deck_count === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-400">
                        {formatSignupDate(user.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
