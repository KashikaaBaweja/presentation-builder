import type { ComponentType } from "react";
import { SLIDE_TYPE_LABELS } from "@/lib/constants";
import type { SlideContent, SlideType } from "@/store/types";
import { Slide01Cover } from "./Slide01Cover";
import { Slide02Agenda } from "./Slide02Agenda";
import { Slide03Problem } from "./Slide03Problem";
import { Slide04Solution } from "./Slide04Solution";
import { Slide05HowItWorks } from "./Slide05HowItWorks";
import { Slide06Features } from "./Slide06Features";
import { Slide07Testimonials } from "./Slide07Testimonials";
import { Slide08Pricing } from "./Slide08Pricing";
import { Slide09Team } from "./Slide09Team";
import { Slide10CTA } from "./Slide10CTA";
import { SlideCustom } from "./SlideCustom";

export const SLIDE_COMPONENTS: Record<SlideType, ComponentType<object>> = {
  cover: Slide01Cover,
  agenda: Slide02Agenda,
  problem: Slide03Problem,
  solution: Slide04Solution,
  howItWorks: Slide05HowItWorks,
  features: Slide06Features,
  testimonials: Slide07Testimonials,
  pricing: Slide08Pricing,
  team: Slide09Team,
  cta: Slide10CTA,
  custom: SlideCustom,
};

export const TEMPLATE_SLIDE_TYPE_OPTIONS = (
  Object.keys(SLIDE_COMPONENTS) as SlideType[]
)
  .filter((type) => type !== "custom")
  .map((type) => ({
    type,
    label: SLIDE_TYPE_LABELS[type],
  }));

export const CUSTOM_SLIDE_TYPE_OPTIONS = [
  { type: "custom" as const, label: "Title & Text", layout: "content" as const },
  { type: "custom" as const, label: "Bullet List", layout: "bullets" as const },
  { type: "custom" as const, label: "Two Column", layout: "split" as const },
];

export const SLIDE_TYPE_OPTIONS = (
  Object.keys(SLIDE_COMPONENTS) as SlideType[]
).map((type) => ({
  type,
  label: SLIDE_TYPE_LABELS[type],
}));

export function getSlideLabel(type: SlideType): string {
  return SLIDE_TYPE_LABELS[type];
}

export function getSlideSidebarLabel(
  slide: { id: string; type: SlideType },
  slideData: Record<string, SlideContent>
): string {
  if (slide.type === "custom") {
    const data = slideData[slide.id];
    if (data && "headline" in data) {
      const headline = data.headline.trim();
      if (headline) return headline;
    }
  }
  return getSlideLabel(slide.type);
}
