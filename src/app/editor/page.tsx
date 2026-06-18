import { PresentationBuilder } from "@/components/PresentationBuilder";
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

  return (
    <PresentationBuilder
      userEmail={user?.email ?? ""}
      deckId={deck ?? null}
    />
  );
}
