// Single source of truth for the service taxonomy. Drives the homepage index
// (Process) and each /services/[slug] category page.
// Content mirrors vault/projects/lineiqgroup.com/szolgaltatas_taxonomia.md.
//
// Intro strings carry *highlight* markers: the category page renders the marked
// words as oversized Fraunces inline (the Intro/Manifesto mixed-typography
// idiom). Everywhere plain text is needed, run them through plainIntro().

export interface SubService {
  title: string;
  desc: string;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  essence: string; // Kranky one-word signature
  intro: string;
  teaser: string[]; // short labels for the homepage hover reveal (max 3)
  subServices: SubService[];
}

export const services: ServiceCategory[] = [
  {
    slug: "brand-building",
    title: "Brand building",
    essence: "soul.",
    intro:
      "The *foundations* of a brand, from strategy to the visual system, in one hand, so it becomes *recognizable* and inevitable.",
    teaser: ["Positioning and strategy", "Brand narrative", "Logo and identity"],
    subServices: [
      {
        title: "Positioning and strategy",
        desc: "Where you stand in the market, and the one-sentence reason to choose you.",
      },
      {
        title: "Audience and market research",
        desc: "Who you're talking to, what they want to hear, and where to reach them.",
      },
      {
        title: "Brand narrative and tone of voice",
        desc: "The story and the voice the brand speaks with everywhere.",
      },
      {
        title: "Naming",
        desc: "Company, product and campaign names that stick.",
      },
      {
        title: "Logo and identity",
        desc: "The primary mark and the entire system built around it.",
      },
      {
        title: "Visual language and design system",
        desc: "Colors, typography, grid and components as one, with a brand guidelines book.",
      },
      {
        title: "Packaging design",
        desc: "The product that sells on the shelf too.",
      },
      {
        title: "Rebranding",
        desc: "Repositioning and refreshing an existing brand.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Web development",
    essence: "craft.",
    intro:
      "Animated, *awwwards-grade* sites built on Next.js, lightning fast and *alive* under your hands.",
    teaser: ["Custom website", "Web design (UI/UX)", "Awwwards animation"],
    subServices: [
      {
        title: "Custom website development",
        desc: "Template-free, tailored to your brand.",
      },
      {
        title: "Web design (UI/UX)",
        desc: "An interface that's clear and converts.",
      },
      {
        title: "Awwwards-grade animation",
        desc: "GSAP, Lenis, motion that sets you apart.",
      },
      {
        title: "Landing page and campaign site",
        desc: "One goal, one message, maximum conversion.",
      },
      {
        title: "CMS integration",
        desc: "Content you manage yourself, without a developer.",
      },
      {
        title: "Performance and technical SEO",
        desc: "Fast loading, Core Web Vitals, a searchable structure.",
      },
      {
        title: "Maintenance and support",
        desc: "The site stays live, updated and secure.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "eCommerce",
    essence: "sell.",
    intro:
      "Online stores that don't just look good but *convert*, from the cart to the *returning* customer.",
    teaser: ["Online store development", "Store UX design", "Shopify setup"],
    subServices: [
      {
        title: "Online store development",
        desc: "A custom or platform-based store that sells.",
      },
      {
        title: "Store UX and product page design",
        desc: "The buying journey and product pages that lead to the cart.",
      },
      {
        title: "Shopify and platform setup",
        desc: "A fast launch on proven foundations.",
      },
      {
        title: "Payment and shipping integration",
        desc: "Hungarian and international solutions wired in.",
      },
      {
        title: "Invoicing integration",
        desc: "Automatic hookup of Számlázz.hu, Billingo and other systems.",
      },
      {
        title: "Conversion optimization (CRO)",
        desc: "Data-driven refinement, continuously.",
      },
    ],
  },
  {
    slug: "software-solutions",
    title: "Software solutions",
    essence: "ship.",
    intro:
      "Custom software, SaaS and internal systems from the same *DNA* we built our own *Klient* platform from.",
    teaser: ["Web application", "App UI/UX design", "MVP development"],
    subServices: [
      {
        title: "Web application development",
        desc: "The SaaS, internal tool or client portal you need.",
      },
      {
        title: "App UI/UX design",
        desc: "A product interface that's self-explanatory.",
      },
      {
        title: "MVP development",
        desc: "A working first version, fast to market.",
      },
      {
        title: "API and integration",
        desc: "Your systems, finally talking to each other.",
      },
      {
        title: "Maintenance and further development",
        desc: "The product doesn't stop at launch.",
      },
    ],
  },
  {
    slug: "mobile-apps",
    title: "Mobile apps",
    essence: "touch.",
    intro:
      "Mobile apps for iOS and Android from *one codebase*, from idea to *store launch* and beyond.",
    teaser: ["Mobile app (iOS and Android)", "Mobile UI/UX design", "Store launch"],
    subServices: [
      {
        title: "Mobile app development (iOS and Android)",
        desc: "One codebase, two platforms.",
      },
      {
        title: "Mobile UI/UX design",
        desc: "A thumb-first interface that's self-explanatory.",
      },
      {
        title: "MVP development",
        desc: "A working first version, fast in the store.",
      },
      {
        title: "Store launch (App Store, Google Play)",
        desc: "Compliance, submission and launch in both stores.",
      },
      {
        title: "Push and notification strategy",
        desc: "Notifications that bring users back, not ones they mute.",
      },
      {
        title: "Maintenance and further development",
        desc: "The app stays live, updated and current with new OS versions.",
      },
    ],
  },
  {
    slug: "marketing",
    title: "Marketing",
    essence: "grow.",
    intro:
      "The brand lives, resonates and *grows*, across paid and organic channels, with *measurable* goals.",
    teaser: ["Paid advertising", "Organic social media", "SEO"],
    subServices: [
      {
        title: "Paid advertising (Meta, Google)",
        desc: "Ads that bring revenue, not just clicks.",
      },
      {
        title: "Organic social media",
        desc: "Content and presence that builds a community.",
      },
      {
        title: "SEO and content marketing",
        desc: "Ongoing discoverability and content that brings people in.",
      },
      {
        title: "Email marketing",
        desc: "The list that stays yours, and turns into buyers.",
      },
      {
        title: "Campaign strategy",
        desc: "A unified plan across channels, with measurable goals.",
      },
    ],
  },
];

export function getService(slug: string): ServiceCategory | undefined {
  return services.find((s) => s.slug === slug);
}

export interface IntroSegment {
  text: string;
  highlight: boolean;
}

// Odd-indexed pieces sit between *markers*, those are the highlighted words.
export function introSegments(intro: string): IntroSegment[] {
  return intro
    .split("*")
    .map((text, i) => ({ text, highlight: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
}

export function plainIntro(intro: string): string {
  return intro.split("*").join("");
}
