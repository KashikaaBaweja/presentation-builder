import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AdminPresentationTable } from "@/components/admin/AdminPresentationTable";
import { requireAdmin } from "@/lib/admin/auth";
import { listAllAdminPresentations } from "@/lib/admin/stats";

export const dynamic = "force-dynamic";

export default async function AdminPresentationsPage() {
  const { supabase } = await requireAdmin();

  let presentations: Awaited<ReturnType<typeof listAllAdminPresentations>> = [];
  let loadError: string | null = null;

  try {
    presentations = await listAllAdminPresentations(supabase);
  } catch (error) {
    console.error("Failed to load admin presentations:", error);
    loadError =
      "Could not load presentations. Check decks and admin RLS policies.";
  }

  return (
    <>
      <AdminPageHeader
        title="Presentations"
        description="Every saved deck across all users. Open any presentation in read-only admin view."
      />

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {loadError}
        </p>
      )}

      {!loadError && (
        <AdminPresentationTable presentations={presentations} />
      )}
    </>
  );
}
