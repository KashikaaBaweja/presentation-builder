"use client";

import { LayoutPicker } from "@/components/LayoutPicker";
import {
  ToolbarDivider,
  ToolbarGroup,
  ToolbarLabel,
  ToolbarSegmented,
  ToolbarSelect,
  ToolbarShell,
} from "@/components/toolbar/ToolbarPrimitives";
import { THEMES } from "@/lib/themes";
import {
  FONT_OPTIONS,
  TEXT_SIZE_OPTIONS,
  type FontId,
  type TextSizeId,
} from "@/lib/typography";
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
      className={`flex h-7 w-7 shrink-0 flex-col overflow-hidden rounded-md border transition-all hover:scale-105 ${
        selected
          ? "border-muted-900 ring-2 ring-muted-900/20"
          : "border-muted-200 hover:border-muted-300"
      }`}
      style={{ backgroundColor: paper }}
      aria-label={`${name} theme`}
      aria-pressed={selected}
    >
      <span className="h-1.5 w-full shrink-0" style={{ backgroundColor: ink }} />
      <span className="flex flex-1 items-end justify-end p-0.5">
        <span
          className="h-2 w-2 rounded-full border border-white/50 shadow-sm"
          style={{ backgroundColor: accent }}
        />
      </span>
    </button>
  );
}

function AccentPicker() {
  const accentColor = usePresentationStore((s) => s.accentColor);
  const setAccentColor = usePresentationStore((s) => s.setAccentColor);

  return (
    <label
      className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-muted-50"
      title="Slide accent color (slides only)"
    >
      <span
        className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-muted-200"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
      <input
        type="color"
        value={accentColor}
        onChange={(e) => setAccentColor(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Slide accent color"
      />
    </label>
  );
}

export function DesignToolbar({
  canManageSlides = true,
}: {
  canManageSlides?: boolean;
}) {
  const themeId = usePresentationStore((s) => s.themeId);
  const setTheme = usePresentationStore((s) => s.setTheme);
  const fontId = usePresentationStore((s) => s.fontId);
  const textSizeId = usePresentationStore((s) => s.textSizeId);
  const setFontId = usePresentationStore((s) => s.setFontId);
  const setTextSizeId = usePresentationStore((s) => s.setTextSizeId);

  return (
    <ToolbarShell>
      <ToolbarGroup className="px-1">
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
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup className="gap-2">
        <ToolbarLabel>Font</ToolbarLabel>
        <ToolbarSelect
          value={fontId}
          onChange={(value) => setFontId(value as FontId)}
          aria-label="Font family"
        >
          {FONT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </ToolbarSelect>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup className="gap-2">
        <ToolbarLabel>Size</ToolbarLabel>
        <ToolbarSegmented
          value={textSizeId}
          onChange={(value) => setTextSizeId(value as TextSizeId)}
          aria-label="Text size"
          options={TEXT_SIZE_OPTIONS.map((option) => ({
            id: option.id,
            label: option.label,
            title:
              option.id === "sm"
                ? "Small text"
                : option.id === "lg"
                  ? "Large text"
                  : "Medium text",
          }))}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {canManageSlides && (
        <>
          <ToolbarGroup className="px-0.5">
            <LayoutPicker variant="toolbar" />
          </ToolbarGroup>

          <ToolbarDivider />
        </>
      )}

      <ToolbarGroup className="px-0.5">
        <AccentPicker />
      </ToolbarGroup>
    </ToolbarShell>
  );
}
