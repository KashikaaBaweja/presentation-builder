"use client";

import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect } from "react";

const DECK_THEME_INLINE_VARS = [
  "--accent",
  "--ink",
  "--paper",
  "--background",
  "--foreground",
  "--brand",
] as const;

/**
 * Deck accent/theme must stay on slides only. Strip any inline theme vars from
 * the document root so app buttons and chrome keep the fixed brand color.
 */
export function ThemeSync() {
  const accentColor = usePresentationStore((s) => s.accentColor);
  const inkColor = usePresentationStore((s) => s.inkColor);
  const paperColor = usePresentationStore((s) => s.paperColor);

  useEffect(() => {
    const root = document.documentElement;
    for (const name of DECK_THEME_INLINE_VARS) {
      root.style.removeProperty(name);
    }
  }, [accentColor, inkColor, paperColor]);

  return null;
}
