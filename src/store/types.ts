export interface SolutionCard {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export type SlideType =
  | "cover"
  | "agenda"
  | "problem"
  | "solution"
  | "howItWorks"
  | "features"
  | "testimonials"
  | "pricing"
  | "team"
  | "cta";

export type CoverLayout = "default" | "centered";
export type SolutionLayout = "default" | "stacked";
export type FeaturesLayout = "default" | "list";
export type PricingLayout = "default" | "table";

export interface CoverData {
  company: string;
  title: string;
  tagline: string;
  date: string;
  layout?: CoverLayout;
}

export interface AgendaData {
  items: string[];
}

export interface ProblemData {
  headline: string;
  paragraphs: string[];
}

export interface SolutionData {
  headline: string;
  cards: SolutionCard[];
  layout?: SolutionLayout;
}

export interface HowItWorksData {
  headline: string;
  steps: ProcessStep[];
}

export interface FeaturesData {
  headline: string;
  items: FeatureItem[];
  layout?: FeaturesLayout;
}

export interface TestimonialsData {
  headline: string;
  items: Testimonial[];
}

export interface PricingData {
  headline: string;
  plans: PricingPlan[];
  layout?: PricingLayout;
}

export interface TeamData {
  headline: string;
  members: TeamMember[];
}

export interface CtaData {
  headline: string;
  subtext: string;
  email: string;
  website: string;
  buttonLabel: string;
}

export interface SlideDataMap {
  cover: CoverData;
  agenda: AgendaData;
  problem: ProblemData;
  solution: SolutionData;
  howItWorks: HowItWorksData;
  features: FeaturesData;
  testimonials: TestimonialsData;
  pricing: PricingData;
  team: TeamData;
  cta: CtaData;
}

export type SlideContent = SlideDataMap[SlideType];

export interface DeckSlide {
  id: string;
  type: SlideType;
}

export interface PresentationState {
  slides: DeckSlide[];
  slideData: Record<string, SlideContent>;
  currentSlide: number;
  accentColor: string;
  logoUrl: string | null;
  showLogoOnAllSlides: boolean;
  isExporting: boolean;
}
