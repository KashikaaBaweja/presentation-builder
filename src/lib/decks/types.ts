import type { DeckSlide, SlideContent } from "@/store/types";

export interface DeckContent {
  slides: DeckSlide[];
  slideData: Record<string, SlideContent>;
  showLogoOnAllSlides: boolean;
}

export interface DeckRow {
  id: string;
  user_id: string;
  title: string;
  content: DeckContent;
  theme_id: string | null;
  accent: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeckSummary {
  id: string;
  title: string;
  updated_at: string;
}

export interface DeckSavePayload {
  title: string;
  content: DeckContent;
  theme_id: string | null;
  accent: string;
  logo: string | null;
}
