import type { SupabaseClient } from "@supabase/supabase-js";
import { parseDeckContent } from "./utils";
import type { DeckRow, DeckSavePayload, DeckSummary } from "./types";

export async function listDecksForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<DeckSummary[]> {
  const { data, error } = await supabase
    .from("decks")
    .select("id, title, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as DeckSummary[];
}

export async function fetchDeckById(
  supabase: SupabaseClient,
  deckId: string
): Promise<DeckRow | null> {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", deckId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const content = parseDeckContent(data.content);
  if (!content) return null;

  return { ...(data as DeckRow), content };
}

export async function saveDeckForUser(
  supabase: SupabaseClient,
  userId: string,
  deckId: string | null,
  payload: DeckSavePayload
): Promise<string> {
  if (deckId) {
    const { error } = await supabase
      .from("decks")
      .update({
        title: payload.title,
        content: payload.content,
        theme_id: payload.theme_id,
        accent: payload.accent,
        logo: payload.logo,
      })
      .eq("id", deckId)
      .eq("user_id", userId);

    if (error) throw error;
    return deckId;
  }

  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: userId,
      title: payload.title,
      content: payload.content,
      theme_id: payload.theme_id,
      accent: payload.accent,
      logo: payload.logo,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}
