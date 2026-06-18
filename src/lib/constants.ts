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
} as const;

/** @deprecated Use SLIDE_TYPE_LABELS with dynamic slides */
export const SLIDE_NAMES = Object.values(SLIDE_TYPE_LABELS);

export const DEFAULT_ACCENT = "#6366f1";

export const THEME_PRESETS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Sky", value: "#0ea5e9" },
] as const;
