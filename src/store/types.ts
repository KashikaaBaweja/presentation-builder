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

export interface PresentationData {
  cover: {
    company: string;
    title: string;
    tagline: string;
    date: string;
  };
  agenda: {
    items: string[];
  };
  problem: {
    headline: string;
    paragraphs: string[];
  };
  solution: {
    headline: string;
    cards: SolutionCard[];
  };
  howItWorks: {
    headline: string;
    steps: ProcessStep[];
  };
  features: {
    headline: string;
    items: FeatureItem[];
  };
  testimonials: {
    headline: string;
    items: Testimonial[];
  };
  pricing: {
    headline: string;
    plans: PricingPlan[];
  };
  team: {
    headline: string;
    members: TeamMember[];
  };
  cta: {
    headline: string;
    subtext: string;
    email: string;
    website: string;
    buttonLabel: string;
  };
}

export interface PresentationState {
  data: PresentationData;
  currentSlide: number;
  accentColor: string;
  logoUrl: string | null;
  showLogoOnAllSlides: boolean;
  isExporting: boolean;
}
