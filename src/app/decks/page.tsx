import { AccountMenu } from "@/components/AccountMenu";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DecksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";

  return (
    <div className="min-h-full bg-paper">
      <header className="flex items-center justify-between border-b border-muted-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            PB
          </div>
          <h1 className="font-heading text-sm font-semibold text-ink">
            My Decks
          </h1>
        </div>
        {email && <AccountMenu email={email} />}
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-heading text-3xl font-bold text-ink">
          Your presentations
        </h2>
        <p className="mt-3 text-muted-500">
          Deck cloud sync arrives in the next phase. For now, open the editor to
          build and export locally.
        </p>
        <Link
          href="/editor"
          className="mt-8 inline-flex rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Open editor
        </Link>
      </main>
    </div>
  );
}
