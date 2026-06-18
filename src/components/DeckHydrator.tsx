"use client";

import { fetchDeckById } from "@/lib/decks/decks";
import { createClient } from "@/lib/supabase/client";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect, useRef } from "react";

export function DeckHydrator({
  deckId,
  children,
}: {
  deckId: string | null;
  children: React.ReactNode;
}) {
  const hydrateFromDeck = usePresentationStore((s) => s.hydrateFromDeck);
  const prepareNewDeck = usePresentationStore((s) => s.prepareNewDeck);
  const setIsLoadingDeck = usePresentationStore((s) => s.setIsLoadingDeck);
  const setDeckId = usePresentationStore((s) => s.setDeckId);
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedRef.current === (deckId ?? "new")) return;

    const storeDeckId = usePresentationStore.getState().deckId;
    if (deckId && storeDeckId === deckId) {
      loadedRef.current = deckId;
      setIsLoadingDeck(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoadingDeck(true);

      if (!deckId) {
        prepareNewDeck();
        loadedRef.current = "new";
        if (!cancelled) setIsLoadingDeck(false);
        return;
      }

      try {
        const supabase = createClient();
        const deck = await fetchDeckById(supabase, deckId);

        if (cancelled) return;

        if (!deck) {
          prepareNewDeck();
          setDeckId(null);
          loadedRef.current = "new";
          setIsLoadingDeck(false);
          return;
        }

        hydrateFromDeck(deck);
        loadedRef.current = deckId;
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load deck:", err);
        prepareNewDeck();
        setDeckId(null);
        loadedRef.current = "new";
        setIsLoadingDeck(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    deckId,
    hydrateFromDeck,
    prepareNewDeck,
    setDeckId,
    setIsLoadingDeck,
  ]);

  const isLoadingDeck = usePresentationStore((s) => s.isLoadingDeck);

  if (isLoadingDeck) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted-50">
        <div className="text-sm text-muted-400">Loading presentation…</div>
      </div>
    );
  }

  return <>{children}</>;
}
