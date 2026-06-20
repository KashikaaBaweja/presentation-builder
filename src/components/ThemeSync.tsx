"use client";

import { applyThemeToDocument } from "@/lib/themes";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect } from "react";

export function ThemeSync() {
  const inkColor = usePresentationStore((s) => s.inkColor);
  const paperColor = usePresentationStore((s) => s.paperColor);

  useEffect(() => {
    applyThemeToDocument({
      ink: inkColor,
      paper: paperColor,
    });
  }, [inkColor, paperColor]);

  return null;
}
