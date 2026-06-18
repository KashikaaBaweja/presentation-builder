export interface ThemePreset {
  id: string;
  name: string;
  accent: string;
  ink: string;
  paper: string;
}

export const DEFAULT_THEME_ID = "classic";

export const THEMES: ThemePreset[] = [
  {
    id: "classic",
    name: "Classic",
    accent: "#6366f1",
    ink: "#1e1b4b",
    paper: "#faf9f7",
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    accent: "#c45c26",
    ink: "#3d2914",
    paper: "#f5f0e8",
  },
  {
    id: "cool-slate",
    name: "Cool Slate",
    accent: "#0ea5e9",
    ink: "#0f172a",
    paper: "#f1f5f9",
  },
  {
    id: "sage",
    name: "Sage",
    accent: "#059669",
    ink: "#1a2e1a",
    paper: "#f4f7f4",
  },
  {
    id: "midnight",
    name: "Midnight",
    accent: "#a78bfa",
    ink: "#e8e4f0",
    paper: "#1e1b2e",
  },
];

export const CUSTOM_THEME_ID = "custom";

export function getThemeById(id: string): ThemePreset | undefined {
  return THEMES.find((theme) => theme.id === id);
}

export function getDefaultTheme(): ThemePreset {
  return getThemeById(DEFAULT_THEME_ID) ?? THEMES[0];
}

export function applyThemeToDocument(colors: {
  accent: string;
  ink: string;
  paper: string;
}) {
  const root = document.documentElement;
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--ink", colors.ink);
  root.style.setProperty("--paper", colors.paper);
  root.style.setProperty("--background", colors.paper);
  root.style.setProperty("--foreground", colors.ink);
}
