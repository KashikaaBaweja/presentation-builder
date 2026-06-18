import type { ComponentType } from "react";
import { SLIDE_TYPE_LABELS } from "@/lib/constants";
import type { SlideType } from "@/store/types";
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
};

export const SLIDE_TYPE_OPTIONS = (
  Object.keys(SLIDE_COMPONENTS) as SlideType[]
).map((type) => ({
  type,
  label: SLIDE_TYPE_LABELS[type],
}));

export function getSlideLabel(type: SlideType): string {
  return SLIDE_TYPE_LABELS[type];
}
