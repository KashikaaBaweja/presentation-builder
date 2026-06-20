"use client";

import {
  FONT_OPTIONS,
  TEXT_SIZE_OPTIONS,
  type FontId,
  type TextSizeId,
} from "@/lib/typography";
import { usePresentationStore } from "@/store/usePresentationStore";

export function TypographyPicker() {
  const fontId = usePresentationStore((s) => s.fontId);
  const textSizeId = usePresentationStore((s) => s.textSizeId);
  const setFontId = usePresentationStore((s) => s.setFontId);
  const setTextSizeId = usePresentationStore((s) => s.setTextSizeId);

  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-400">Font</span>
        <select
          value={fontId}
          onChange={(e) => setFontId(e.target.value as FontId)}
          className="rounded-lg border border-muted-200 bg-white px-2 py-1 text-xs text-muted-700"
          aria-label="Presentation font"
        >
          {FONT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-400">Size</span>
        <div className="flex rounded-lg border border-muted-200 bg-white p-0.5">
          {TEXT_SIZE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              title={
                option.id === "sm"
                  ? "Small text"
                  : option.id === "lg"
                    ? "Large text"
                    : "Medium text"
              }
              onClick={() => setTextSizeId(option.id as TextSizeId)}
              className={`min-w-7 rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                textSizeId === option.id
                  ? "bg-muted-900 text-white"
                  : "text-muted-600 hover:bg-muted-50"
              }`}
              aria-pressed={textSizeId === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
