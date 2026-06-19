import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { requireAdmin } from "@/lib/admin/auth";
import { listAdminUsers } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { supabase } = await requireAdmin();

  let users: Awaited<ReturnType<typeof listAdminUsers>> = [];
  let loadError: string | null = null;

  try {
    users = await listAdminUsers(supabase);
  } catch (error) {
    console.error("Failed to load admin users:", error);
    loadError = "Could not load users. Check profiles and admin RLS policies.";
  }

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="All registered accounts, signup dates, and saved presentation counts."
      />

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {loadError}
        </p>
      )}

      {!loadError && <AdminUserTable users={users} />}
    </>
  );
}
