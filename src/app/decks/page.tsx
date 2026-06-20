import { AccountMenu } from "@/components/AccountMenu";
import { AdminHeaderLink } from "@/components/admin/AdminHeaderLink";
import { AppLogo } from "@/components/AppLogo";
import { listDecksForUser } from "@/lib/decks/decks";
import { formatDeckUpdatedAt, UNTITLED_DECK } from "@/lib/decks/utils";
import { getCurrentUserProfile, isAdmin } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DecksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const profile = user ? await getCurrentUserProfile(supabase) : null;
  const userIsAdmin = isAdmin(profile);
  let decks: Awaited<ReturnType<typeof listDecksForUser>> = [];
  let loadError: string | null = null;

  if (user) {
    try {
      decks = await listDecksForUser(supabase, user.id);
    } catch (error) {
      console.error("Failed to load decks:", error);
      loadError =
        "Could not load your presentations. Make sure the decks table exists in Supabase.";
    }
  }

  return (
    <div className="min-h-full bg-paper">
      <header className="flex items-center justify-between border-b border-muted-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <AppLogo size={36} />
          <h1 className="font-heading text-sm font-semibold text-ink">
            My Decks
          </h1>
        </div>
        {email && (
          <div className="flex items-center gap-3">
            {userIsAdmin && <AdminHeaderLink />}
            <AccountMenu email={email} isAdmin={userIsAdmin} />
          </div>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink">
              Your presentations
            </h2>
            <p className="mt-2 text-sm text-muted-500">
              Open a saved deck or start a new one.
            </p>
          </div>
          <Link
            href="/editor"
            className="inline-flex shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            New presentation
          </Link>
        </div>

        {loadError && (
          <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {loadError}
          </p>
        )}

        {!loadError && decks.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-muted-200 bg-white px-6 py-12 text-center">
            <p className="text-muted-500">No saved presentations yet.</p>
            <Link
              href="/editor"
              className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
            >
              Create your first presentation
            </Link>
          </div>
        )}

        {decks.length > 0 && (
          <ul className="mt-8 divide-y divide-muted-100 overflow-hidden rounded-2xl border border-muted-200 bg-white">
            {decks.map((deck) => (
              <li key={deck.id}>
                <Link
                  href={`/editor?deck=${deck.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {deck.title?.trim() || UNTITLED_DECK}
                    </p>
                    <p className="mt-1 text-xs text-muted-400">
                      Updated {formatDeckUpdatedAt(deck.updated_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-accent">Open</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
