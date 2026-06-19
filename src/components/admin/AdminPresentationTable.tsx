import { formatDeckUpdatedAt, UNTITLED_DECK } from "@/lib/decks/utils";
import type { AdminPresentationRow } from "@/lib/admin/stats";
import Link from "next/link";

export function AdminPresentationTable({
  presentations,
}: {
  presentations: AdminPresentationRow[];
}) {
  if (presentations.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-muted-200 bg-white px-6 py-12 text-center text-sm text-muted-500">
        No presentations saved yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-muted-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-muted-100 bg-muted-50 text-xs font-medium uppercase tracking-wide text-muted-500">
          <tr>
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Owner</th>
            <th className="px-5 py-3">Updated</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted-100">
          {presentations.map((presentation) => (
            <tr key={presentation.id} className="transition-colors hover:bg-muted-50">
              <td className="px-5 py-4 font-medium text-ink">
                {presentation.title?.trim() || UNTITLED_DECK}
              </td>
              <td className="px-5 py-4 text-muted-600">{presentation.owner_email}</td>
              <td className="px-5 py-4 text-muted-600">
                {formatDeckUpdatedAt(presentation.updated_at)}
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  href={`/editor?deck=${presentation.id}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
