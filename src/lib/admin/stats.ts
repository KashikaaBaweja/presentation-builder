import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminUserRow } from "./users";
import { listAdminUsers } from "./users";

export interface AdminStats {
  totalUsers: number;
  totalPresentations: number;
  activeUsers: number;
  newUsersThisWeek: number;
}

export interface AdminPresentationRow {
  id: string;
  title: string;
  updated_at: string;
  user_id: string;
  owner_email: string;
}

export async function listAllAdminPresentations(
  supabase: SupabaseClient
): Promise<AdminPresentationRow[]> {
  const { data: decks, error } = await supabase
    .from("decks")
    .select("id, title, updated_at, user_id")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email");

  if (profilesError) throw profilesError;

  const emailById = new Map(
    (profiles ?? []).map((profile) => [profile.id as string, profile.email as string])
  );

  return (decks ?? []).map((deck) => ({
    id: deck.id as string,
    title: (deck.title as string) ?? "Untitled presentation",
    updated_at: deck.updated_at as string,
    user_id: deck.user_id as string,
    owner_email: emailById.get(deck.user_id as string) ?? "Unknown",
  }));
}

export async function getAdminStats(
  supabase: SupabaseClient
): Promise<{ stats: AdminStats; users: AdminUserRow[]; presentations: AdminPresentationRow[] }> {
  const users = await listAdminUsers(supabase);
  const presentations = await listAllAdminPresentations(supabase);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newUsersThisWeek = users.filter((user) => {
    if (!user.created_at) return false;
    return new Date(user.created_at).getTime() >= weekAgo;
  }).length;

  return {
    users,
    presentations,
    stats: {
      totalUsers: users.length,
      totalPresentations: presentations.length,
      activeUsers: users.filter((user) => user.deck_count > 0).length,
      newUsersThisWeek,
    },
  };
}
