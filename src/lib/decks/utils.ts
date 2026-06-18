import { THEME_PRESETS } from "@/lib/constants";
import type { DeckSlide, SlideContent } from "@/store/types";
import type { CoverData } from "@/store/types";
import type { DeckContent } from "./types";

export const UNTITLED_DECK = "Untitled presentation";

export function accentToThemeId(accent: string): string | null {
  const preset = THEME_PRESETS.find((p) => p.value === accent);
  return preset ? preset.name.toLowerCase() : null;
}

export function getDeckTitle(
  slides: DeckSlide[],
  slideData: Record<string, SlideContent>
): string {
  const cover = slides.find((s) => s.type === "cover") ?? slides[0];
  if (!cover) return UNTITLED_DECK;

  const data = slideData[cover.id] as CoverData | undefined;
  const title = data?.title?.trim();
  return title || UNTITLED_DECK;
}

export function parseDeckContent(raw: unknown): DeckContent | null {
  if (!raw || typeof raw !== "object") return null;

  const value = raw as Partial<DeckContent>;
  if (!Array.isArray(value.slides) || !value.slideData) return null;

  return {
    slides: value.slides,
    slideData: value.slideData,
    showLogoOnAllSlides: Boolean(value.showLogoOnAllSlides),
  };
}

export function formatDeckUpdatedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
