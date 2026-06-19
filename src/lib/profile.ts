import type { SupabaseClient } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  email: string;
  role: string;
  created_at?: string | null;
}

export function isAdmin(profile: Profile | null | undefined): boolean {
  return profile?.role === "admin";
}

export async function getProfileById(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function getCurrentUserProfile(
  supabase: SupabaseClient
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return getProfileById(supabase, user.id);
}
