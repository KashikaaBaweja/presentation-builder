import { PresentationBuilder } from "@/components/PresentationBuilder";
import { fetchDeckById } from "@/lib/decks/decks";
import { getCurrentUserProfile, isAdmin } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ deck?: string }>;
}) {
  const { deck } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getCurrentUserProfile(supabase) : null;
  const userIsAdmin = isAdmin(profile);

  let readOnlyDeck = false;
  if (deck && user) {
    const deckRow = await fetchDeckById(supabase, deck);
    readOnlyDeck = Boolean(deckRow && deckRow.user_id !== user.id);
  }

  return (
    <PresentationBuilder
      userEmail={user?.email ?? ""}
      deckId={deck ?? null}
      isAdmin={userIsAdmin}
      readOnlyDeck={readOnlyDeck}
    />
  );
}
