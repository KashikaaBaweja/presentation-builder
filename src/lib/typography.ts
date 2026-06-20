export type FontId = "plus-jakarta" | "inter" | "serif" | "mono";
export type TextSizeId = "sm" | "md" | "lg";

export const DEFAULT_FONT_ID: FontId = "plus-jakarta";
export const DEFAULT_TEXT_SIZE_ID: TextSizeId = "md";

export const FONT_OPTIONS: { id: FontId; label: string }[] = [
  { id: "plus-jakarta", label: "Plus Jakarta" },
  { id: "inter", label: "Inter" },
  { id: "serif", label: "Georgia" },
  { id: "mono", label: "Monospace" },
];

export const TEXT_SIZE_OPTIONS: { id: TextSizeId; label: string; basePx: number }[] =
  [
    { id: "sm", label: "S", basePx: 14 },
    { id: "md", label: "M", basePx: 16 },
    { id: "lg", label: "L", basePx: 18 },
  ];

const FONT_STACKS: Record<FontId, { heading: string; body: string }> = {
  "plus-jakarta": {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
  },
  inter: {
    heading: "var(--font-body)",
    body: "var(--font-body)",
  },
  serif: {
    heading: 'Georgia, "Times New Roman", serif',
    body: 'Georgia, "Times New Roman", serif',
  },
  mono: {
    heading:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    body: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
};

export function isFontId(value: string | undefined): value is FontId {
  return FONT_OPTIONS.some((option) => option.id === value);
}

export function isTextSizeId(value: string | undefined): value is TextSizeId {
  return TEXT_SIZE_OPTIONS.some((option) => option.id === value);
}

export function parseFontId(value: string | undefined): FontId {
  return isFontId(value) ? value : DEFAULT_FONT_ID;
}

export function parseTextSizeId(value: string | undefined): TextSizeId {
  return isTextSizeId(value) ? value : DEFAULT_TEXT_SIZE_ID;
}

export function resolveFontStacks(fontId: string | undefined) {
  const id = isFontId(fontId) ? fontId : DEFAULT_FONT_ID;
  return FONT_STACKS[id];
}

export function resolveTextSizeBasePx(textSizeId: string | undefined) {
  const id = isTextSizeId(textSizeId) ? textSizeId : DEFAULT_TEXT_SIZE_ID;
  return TEXT_SIZE_OPTIONS.find((option) => option.id === id)?.basePx ?? 16;
}
