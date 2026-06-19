import type { InitialContent } from "@/lib/initialContent";
import { initialContent } from "@/lib/initialContent";

type GeneratedSlideType = keyof InitialContent;

const SLIDE_TYPES = Object.keys(initialContent) as GeneratedSlideType[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string")
  );
}

function validateCover(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.company) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.tagline) &&
    isNonEmptyString(value.date)
  );
}

function validateAgenda(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isStringArray(value.items);
}

function validateProblem(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.headline) && isStringArray(value.paragraphs);
}

function validateSolution(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.headline) || !Array.isArray(value.cards)) {
    return false;
  }
  return value.cards.every(
    (card) =>
      isRecord(card) &&
      isNonEmptyString(card.title) &&
      isNonEmptyString(card.description)
  );
}

function validateHowItWorks(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.headline) || !Array.isArray(value.steps)) {
    return false;
  }
  return value.steps.every(
    (step) =>
      isRecord(step) &&
      isNonEmptyString(step.title) &&
      isNonEmptyString(step.description)
  );
}

function validateFeatures(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.headline) || !Array.isArray(value.items)) {
    return false;
  }
  return value.items.every(
    (item) =>
      isRecord(item) &&
      isNonEmptyString(item.title) &&
      isNonEmptyString(item.description)
  );
}

function validateTestimonials(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.headline) || !Array.isArray(value.items)) {
    return false;
  }
  return value.items.every(
    (item) =>
      isRecord(item) &&
      isNonEmptyString(item.quote) &&
      isNonEmptyString(item.name) &&
      isNonEmptyString(item.title) &&
      isNonEmptyString(item.company)
  );
}

function validatePricing(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.headline) || !Array.isArray(value.plans)) {
    return false;
  }
  return value.plans.every(
    (plan) =>
      isRecord(plan) &&
      isNonEmptyString(plan.name) &&
      isNonEmptyString(plan.price) &&
      isStringArray(plan.features)
  );
}

function validateTeam(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.headline) || !Array.isArray(value.members)) {
    return false;
  }
  return value.members.every(
    (member) =>
      isRecord(member) &&
      isNonEmptyString(member.name) &&
      isNonEmptyString(member.role) &&
      isNonEmptyString(member.initials)
  );
}

function validateCta(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.headline) &&
    isNonEmptyString(value.subtext) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.website) &&
    isNonEmptyString(value.buttonLabel)
  );
}

const validators: Record<GeneratedSlideType, (value: unknown) => boolean> = {
  cover: validateCover,
  agenda: validateAgenda,
  problem: validateProblem,
  solution: validateSolution,
  howItWorks: validateHowItWorks,
  features: validateFeatures,
  testimonials: validateTestimonials,
  pricing: validatePricing,
  team: validateTeam,
  cta: validateCta,
};

export function validateGeneratedContent(
  data: unknown
): data is InitialContent {
  if (!isRecord(data)) return false;

  for (const type of SLIDE_TYPES) {
    if (!(type in data)) return false;
    if (!validators[type](data[type])) return false;
  }

  return true;
}

export function parseGeneratedContent(raw: string): InitialContent | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!validateGeneratedContent(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
