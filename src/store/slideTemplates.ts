import { defaultPresentationData } from "./defaults";
import type { SlideContent, SlideDataMap, SlideType } from "./types";

export function createSlideData<T extends SlideType>(type: T): SlideDataMap[T] {
  const source = defaultPresentationData;
  switch (type) {
    case "cover":
      return structuredClone(source.cover) as SlideDataMap[T];
    case "agenda":
      return structuredClone(source.agenda) as SlideDataMap[T];
    case "problem":
      return structuredClone(source.problem) as SlideDataMap[T];
    case "solution":
      return structuredClone(source.solution) as SlideDataMap[T];
    case "howItWorks":
      return structuredClone(source.howItWorks) as SlideDataMap[T];
    case "features":
      return structuredClone(source.features) as SlideDataMap[T];
    case "testimonials":
      return structuredClone(source.testimonials) as SlideDataMap[T];
    case "pricing":
      return structuredClone(source.pricing) as SlideDataMap[T];
    case "team":
      return structuredClone(source.team) as SlideDataMap[T];
    case "cta":
      return structuredClone(source.cta) as SlideDataMap[T];
  }
}

export function createSlideId(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isSlideContent(value: unknown): value is SlideContent {
  return typeof value === "object" && value !== null;
}
