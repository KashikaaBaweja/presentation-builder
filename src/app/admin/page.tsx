import { AccountMenu } from "@/components/AccountMenu";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { AppLogo } from "@/components/AppLogo";
import { listAdminUsers } from "@/lib/admin/users";
import { getCurrentUserProfile, isAdmin } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const profile = await getCurrentUserProfile(supabase);

  if (!isAdmin(profile)) {
    redirect("/");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let users: Awaited<ReturnType<typeof listAdminUsers>> = [];
  let loadError: string | null = null;

  try {
    users = await listAdminUsers(supabase);
  } catch (error) {
    console.error("Failed to load admin users:", error);
    loadError = "Could not load users. Check profiles and admin RLS policies.";
  }

  return (
    <div className="min-h-full bg-paper">
      <header className="flex items-center justify-between border-b border-muted-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <AppLogo size={36} />
          <h1 className="font-heading text-sm font-semibold text-ink">Admin</h1>
        </div>
        {user?.email && (
          <AccountMenu email={user.email} isAdmin />
        )}
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink">Users</h2>
            <p className="mt-2 text-sm text-muted-500">
              All accounts and their saved presentations.
            </p>
          </div>
          <Link
            href="/decks"
            className="shrink-0 text-sm font-medium text-accent hover:underline"
          >
            Back to decks
          </Link>
        </div>

        {loadError && (
          <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {loadError}
          </p>
        )}

        {!loadError && (
          <div className="mt-8">
            <AdminUserTable users={users} />
          </div>
        )}
      </main>
    </div>
  );
}
