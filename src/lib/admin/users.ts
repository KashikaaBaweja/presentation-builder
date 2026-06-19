import type { DeckSummary } from "@/lib/decks/types";
import { listDecksForUser } from "@/lib/decks/decks";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AdminUserRow {
  id: string;
  email: string;
  created_at: string | null;
  deck_count: number;
}

export async function listAdminUsers(
  supabase: SupabaseClient
): Promise<AdminUserRow[]> {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, created_at")
    .order("email");

  if (error) throw error;

  const { data: decks, error: decksError } = await supabase
    .from("decks")
    .select("user_id");

  if (decksError) throw decksError;

  const deckCounts = new Map<string, number>();
  for (const deck of decks ?? []) {
    const userId = deck.user_id as string;
    deckCounts.set(userId, (deckCounts.get(userId) ?? 0) + 1);
  }

  return (profiles ?? []).map((profile) => ({
    id: profile.id as string,
    email: profile.email as string,
    created_at: (profile.created_at as string | null) ?? null,
    deck_count: deckCounts.get(profile.id as string) ?? 0,
  }));
}

export async function listDecksForAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<DeckSummary[]> {
  return listDecksForUser(supabase, userId);
}
