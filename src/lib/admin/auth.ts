import { getCurrentUserProfile, isAdmin } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();
  const profile = await getCurrentUserProfile(supabase);

  if (!isAdmin(profile)) {
    redirect("/");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user, profile };
}
