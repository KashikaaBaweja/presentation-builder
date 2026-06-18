"use client";

import { THEMES } from "@/lib/themes";
import { usePresentationStore } from "@/store/usePresentationStore";

function ThemeSwatch({
  name,
  accent,
  ink,
  paper,
  selected,
  onSelect,
}: {
  name: string;
  accent: string;
  ink: string;
  paper: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      title={name}
      onClick={onSelect}
      className={`flex h-9 w-9 flex-col overflow-hidden rounded-lg border-2 transition-transform hover:scale-105 ${
        selected ? "border-ink scale-105" : "border-muted-200"
      }`}
      style={{ backgroundColor: paper }}
      aria-label={`${name} theme`}
      aria-pressed={selected}
    >
      <span className="h-2 w-full shrink-0" style={{ backgroundColor: ink }} />
      <span className="flex flex-1 items-end justify-end p-0.5">
        <span
          className="h-3 w-3 rounded-full border border-white/40 shadow-sm"
          style={{ backgroundColor: accent }}
        />
      </span>
    </button>
  );
}

export function ThemePicker() {
  const themeId = usePresentationStore((s) => s.themeId);
  const setTheme = usePresentationStore((s) => s.setTheme);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-400">Theme</span>
      <div className="flex gap-1.5">
        {THEMES.map((theme) => (
          <ThemeSwatch
            key={theme.id}
            name={theme.name}
            accent={theme.accent}
            ink={theme.ink}
            paper={theme.paper}
            selected={themeId === theme.id}
            onSelect={() => setTheme(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}
