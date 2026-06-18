export const SLIDE_WIDTH = 1280;
export const SLIDE_HEIGHT = 720;
export const PDF_SCALE = 2; // ~192 DPI equivalent for crisp export

export const SLIDE_NAMES = [
  "Cover",
  "Agenda",
  "Problem",
  "Solution",
  "How It Works",
  "Features",
  "Testimonials",
  "Pricing",
  "Team",
  "Call to Action",
] as const;

export const DEFAULT_ACCENT = "#6366f1";

export const THEME_PRESETS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Sky", value: "#0ea5e9" },
] as const;
