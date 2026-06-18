import { createSlideData } from "./slideTemplates";
import type { DeckSlide, SlideContent } from "./types";

const INITIAL_SLIDE_TYPES = [
  "cover",
  "agenda",
  "problem",
  "solution",
  "howItWorks",
  "features",
  "testimonials",
  "pricing",
  "team",
  "cta",
] as const;

export function createInitialDeck(): {
  slides: DeckSlide[];
  slideData: Record<string, SlideContent>;
} {
  const slides: DeckSlide[] = INITIAL_SLIDE_TYPES.map((type, index) => ({
    id: `slide-${index + 1}`,
    type,
  }));

  const slideData: Record<string, SlideContent> = {};
  for (const slide of slides) {
    slideData[slide.id] = createSlideData(slide.type);
  }

  return { slides, slideData };
}

export const { slides: defaultSlides, slideData: defaultSlideData } =
  createInitialDeck();
