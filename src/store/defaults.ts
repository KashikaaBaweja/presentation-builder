import type {
  AgendaData,
  CoverData,
  CtaData,
  CustomData,
  FeaturesData,
  HowItWorksData,
  PricingData,
  ProblemData,
  SolutionData,
  TeamData,
  TestimonialsData,
} from "./types";

/** Default placeholder content used when creating new themed slides */
export const defaultPresentationData = {
  cover: {
    company: "Acme Corp",
    title: "Product Launch Presentation",
    tagline: "Transforming the way teams collaborate and deliver",
    date: "June 2026",
    layout: "default",
  } satisfies CoverData,
  agenda: {
    items: [
      "The Problem We're Solving",
      "Our Solution Overview",
      "How It Works",
      "Key Features & Benefits",
      "Social Proof & Results",
      "Pricing & Next Steps",
    ],
  } satisfies AgendaData,
  problem: {
    headline: "Teams waste hours on fragmented workflows",
    paragraphs: [
      "Modern teams juggle dozens of disconnected tools, leading to context switching, duplicated effort, and missed deadlines. The average knowledge worker loses 2.5 hours per day to inefficient processes.",
      "Existing solutions are either too complex for daily use or too simplistic to handle real-world workflows. Teams need something that bridges the gap — powerful yet intuitive.",
      "Without a unified approach, organizations struggle to maintain consistency, onboard new members, and scale their operations effectively.",
    ],
  } satisfies ProblemData,
  solution: {
    headline: "One platform. Every workflow.",
    layout: "default",
    cards: [
      {
        title: "Unified Workspace",
        description:
          "Bring all your tools, documents, and conversations into a single, organized environment that your team will actually use.",
      },
      {
        title: "Smart Automation",
        description:
          "Automate repetitive tasks with intelligent workflows that learn from your team's patterns and adapt over time.",
      },
      {
        title: "Real-time Insights",
        description:
          "Get actionable analytics on team performance, project health, and resource allocation — all in one dashboard.",
      },
    ],
  } satisfies SolutionData,
  howItWorks: {
    headline: "Get started in three simple steps",
    steps: [
      {
        title: "Connect Your Tools",
        description:
          "Integrate with your existing stack in minutes. We support 50+ popular apps out of the box.",
      },
      {
        title: "Configure Workflows",
        description:
          "Use our visual builder to create custom workflows tailored to your team's unique processes.",
      },
      {
        title: "Launch & Scale",
        description:
          "Roll out to your team, track adoption, and iterate with built-in feedback loops and analytics.",
      },
    ],
  } satisfies HowItWorksData,
  features: {
    headline: "Everything you need to succeed",
    layout: "default",
    items: [
      {
        title: "Collaborative Editing",
        description: "Work together in real-time with live cursors and instant sync.",
      },
      {
        title: "Version History",
        description: "Never lose work with automatic versioning and one-click restore.",
      },
      {
        title: "Advanced Permissions",
        description: "Granular access controls for teams, projects, and documents.",
      },
      {
        title: "API & Integrations",
        description: "Connect to your stack with our robust REST API and webhooks.",
      },
      {
        title: "Mobile Ready",
        description: "Full-featured mobile apps for iOS and Android.",
      },
      {
        title: "Enterprise Security",
        description: "SOC 2 Type II certified with SSO, audit logs, and encryption.",
      },
    ],
  } satisfies FeaturesData,
  testimonials: {
    headline: "Trusted by industry leaders",
    items: [
      {
        quote:
          "This platform transformed how our 200-person team operates. We cut meeting time by 40% and shipped products 2x faster.",
        name: "Sarah Chen",
        title: "VP of Engineering",
        company: "TechFlow Inc.",
      },
      {
        quote:
          "The ROI was immediate. Within the first month, we eliminated three redundant tools and saved over $50K annually.",
        name: "Marcus Williams",
        title: "Chief Operations Officer",
        company: "ScaleUp Ventures",
      },
    ],
  } satisfies TestimonialsData,
  pricing: {
    headline: "Simple, transparent pricing",
    layout: "default",
    plans: [
      {
        name: "Starter",
        price: "$29/mo",
        features: [
          "Up to 10 team members",
          "5 GB storage",
          "Basic integrations",
          "Email support",
        ],
      },
      {
        name: "Professional",
        price: "$79/mo",
        features: [
          "Up to 50 team members",
          "100 GB storage",
          "Advanced integrations",
          "Priority support",
          "Custom workflows",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: [
          "Unlimited team members",
          "Unlimited storage",
          "SSO & SAML",
          "Dedicated success manager",
          "SLA guarantee",
        ],
      },
    ],
  } satisfies PricingData,
  team: {
    headline: "Meet the team",
    members: [
      { name: "Alex Rivera", role: "CEO & Co-founder", initials: "AR" },
      { name: "Jordan Kim", role: "CTO & Co-founder", initials: "JK" },
      { name: "Taylor Morgan", role: "Head of Design", initials: "TM" },
      { name: "Casey Brooks", role: "Head of Growth", initials: "CB" },
    ],
  } satisfies TeamData,
  cta: {
    headline: "Ready to transform your workflow?",
    subtext:
      "Join thousands of teams already using our platform to work smarter, not harder.",
    email: "hello@acmecorp.com",
    website: "www.acmecorp.com",
    buttonLabel: "Start Free Trial",
  } satisfies CtaData,
  custom: {
    headline: "Your headline",
    subheadline: "Optional subtitle",
    body: "Add your main content here. Click any text to edit.",
    bullets: ["First point", "Second point", "Third point"],
    layout: "content",
  } satisfies CustomData,
};
