"use client";

import { applyThemeToDocument } from "@/lib/themes";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect } from "react";

export function ThemeSync() {
  const accentColor = usePresentationStore((s) => s.accentColor);
  const inkColor = usePresentationStore((s) => s.inkColor);
  const paperColor = usePresentationStore((s) => s.paperColor);

  useEffect(() => {
    applyThemeToDocument({
      accent: accentColor,
      ink: inkColor,
      paper: paperColor,
    });
  }, [accentColor, inkColor, paperColor]);

  return null;
}
