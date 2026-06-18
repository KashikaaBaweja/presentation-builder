import type { DeckSlide, SlideContent, CoverData } from "@/store/types";
import type { DeckContent } from "./types";

export const UNTITLED_DECK = "Untitled presentation";

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
    ink: typeof value.ink === "string" ? value.ink : undefined,
    paper: typeof value.paper === "string" ? value.paper : undefined,
  };
}

export function formatDeckUpdatedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
