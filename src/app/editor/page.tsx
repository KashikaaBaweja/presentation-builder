import { PresentationBuilder } from "@/components/PresentationBuilder";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PresentationBuilder userEmail={user?.email ?? ""} />;
}
