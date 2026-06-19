import type {
  CoverLayout,
  CustomLayout,
  FeaturesLayout,
  PricingLayout,
  SlideType,
  SolutionLayout,
} from "@/store/types";

export type LayoutSlideType =
  | "cover"
  | "solution"
  | "features"
  | "pricing"
  | "custom";

export const LAYOUT_SLIDE_TYPES: LayoutSlideType[] = [
  "cover",
  "solution",
  "features",
  "pricing",
  "custom",
];

export function isLayoutSlideType(type: SlideType): type is LayoutSlideType {
  return (LAYOUT_SLIDE_TYPES as SlideType[]).includes(type);
}

export interface LayoutOption {
  id: string;
  label: string;
}

export const SLIDE_LAYOUT_OPTIONS: Record<LayoutSlideType, LayoutOption[]> = {
  cover: [
    { id: "default", label: "Hero" },
    { id: "centered", label: "Centered" },
  ],
  solution: [
    { id: "default", label: "Cards" },
    { id: "stacked", label: "Stacked" },
  ],
  features: [
    { id: "default", label: "Grid" },
    { id: "list", label: "List" },
  ],
  pricing: [
    { id: "default", label: "Cards" },
    { id: "table", label: "Table" },
  ],
  custom: [
    { id: "content", label: "Title & Text" },
    { id: "bullets", label: "Bullets" },
    { id: "split", label: "Two Column" },
  ],
};

export function getLayoutOptions(type: LayoutSlideType): LayoutOption[] {
  return SLIDE_LAYOUT_OPTIONS[type];
}

export function resolveCoverLayout(layout?: CoverLayout): CoverLayout {
  return layout ?? "default";
}

export function resolveSolutionLayout(layout?: SolutionLayout): SolutionLayout {
  return layout ?? "default";
}

export function resolveFeaturesLayout(layout?: FeaturesLayout): FeaturesLayout {
  return layout ?? "default";
}

export function resolvePricingLayout(layout?: PricingLayout): PricingLayout {
  return layout ?? "default";
}

export function resolveCustomLayout(layout?: CustomLayout): CustomLayout {
  return layout ?? "content";
}
