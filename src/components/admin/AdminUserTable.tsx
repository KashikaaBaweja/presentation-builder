"use client";

import { listDecksForAdmin, type AdminUserRow } from "@/lib/admin/users";
import { formatDeckUpdatedAt } from "@/lib/decks/utils";
import type { DeckSummary } from "@/lib/decks/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Fragment, useCallback, useState } from "react";

function formatSignupDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

export function AdminUserTable({ users }: { users: AdminUserRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [decksByUser, setDecksByUser] = useState<Record<string, DeckSummary[]>>(
    {}
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleRow = useCallback(
    async (userId: string) => {
      if (expandedId === userId) {
        setExpandedId(null);
        return;
      }

      setExpandedId(userId);
      setError(null);

      if (decksByUser[userId]) return;

      setLoadingId(userId);
      try {
        const supabase = createClient();
        const decks = await listDecksForAdmin(supabase, userId);
        setDecksByUser((prev) => ({ ...prev, [userId]: decks }));
      } catch (err) {
        console.error("Failed to load user decks:", err);
        setError("Could not load decks for this user.");
        setExpandedId(null);
      } finally {
        setLoadingId(null);
      }
    },
    [decksByUser, expandedId]
  );

  if (users.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-muted-200 bg-white px-6 py-12 text-center text-sm text-muted-500">
        No users found in profiles.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-muted-200 bg-white">
      {error && (
        <p className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <table className="w-full text-left text-sm">
        <thead className="border-b border-muted-100 bg-muted-50 text-xs font-medium uppercase tracking-wide text-muted-500">
          <tr>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Signed up</th>
            <th className="px-5 py-3">Decks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted-100">
          {users.map((user) => {
            const isExpanded = expandedId === user.id;
            const decks = decksByUser[user.id];
            const isLoading = loadingId === user.id;

            return (
              <Fragment key={user.id}>
                <tr
                  className="cursor-pointer transition-colors hover:bg-muted-50"
                  onClick={() => void toggleRow(user.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      void toggleRow(user.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <td className="px-5 py-4 font-medium text-ink">{user.email}</td>
                  <td className="px-5 py-4 text-muted-600">
                    {formatSignupDate(user.created_at)}
                  </td>
                  <td className="px-5 py-4 text-muted-600">{user.deck_count}</td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={3} className="bg-paper px-5 py-4">
                      {isLoading && (
                        <p className="text-sm text-muted-400">Loading decks…</p>
                      )}
                      {!isLoading && decks && decks.length === 0 && (
                        <p className="text-sm text-muted-500">
                          No saved presentations.
                        </p>
                      )}
                      {!isLoading && decks && decks.length > 0 && (
                        <ul className="divide-y divide-muted-100 rounded-xl border border-muted-200 bg-white">
                          {decks.map((deck) => (
                            <li key={deck.id}>
                              <Link
                                href={`/editor?deck=${deck.id}`}
                                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="truncate font-medium text-ink">
                                  {deck.title?.trim() || "Untitled presentation"}
                                </span>
                                <span className="shrink-0 text-xs text-muted-400">
                                  Updated {formatDeckUpdatedAt(deck.updated_at)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
