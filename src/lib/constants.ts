import { getDefaultTheme } from "@/lib/themes";

export const SLIDE_WIDTH = 1280;
export const SLIDE_HEIGHT = 720;
export const PDF_SCALE = 2; // ~192 DPI equivalent for crisp export

export const SLIDE_TYPE_LABELS = {
  cover: "Cover",
  agenda: "Agenda",
  problem: "Problem",
  solution: "Solution",
  howItWorks: "How It Works",
  features: "Features",
  testimonials: "Testimonials",
  pricing: "Pricing",
  team: "Team",
  cta: "Call to Action",
  custom: "Custom Slide",
} as const;

/** @deprecated Use SLIDE_TYPE_LABELS with dynamic slides */
export const SLIDE_NAMES = Object.values(SLIDE_TYPE_LABELS);

export const DEFAULT_ACCENT = getDefaultTheme().accent;
export const DEFAULT_INK = getDefaultTheme().ink;
export const DEFAULT_PAPER = getDefaultTheme().paper;
