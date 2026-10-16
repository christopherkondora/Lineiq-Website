// Single source of truth for the service catalogue. Drives the homepage index
// (WhatWeDo), each /services/[slug] category page and the redirects from
// retired slugs (serviceRedirects.ts).
// Content mirrors strategy/service_delivery.md in the Kontrast Vault: the five
// listed categories, in its order. Content Management is unlisted for Q4 2026
// (Service Delivery §2.2) and never appears here.
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

// Every category runs through the Dream Outcome Process (Service Delivery §1),
// so every category page says so.
export const processNote =
  "Every engagement runs through the Dream Outcome Process. Research, your customer and your positioning come first; the work is built on them.";

export const services: ServiceCategory[] = [
  {
    slug: "brand-architecture",
    title: "Brand Architecture",
    essence: "soul.",
    intro:
      "The *foundations* of a brand, from strategy to the visual system, in one hand, for companies and for the people who lead them, so it becomes *recognizable*.",
    teaser: ["Positioning and strategy", "Brand world", "Logo and identity"],
    subServices: [
      {
        title: "Audience, market and competitor research",
        desc: "Who you're talking to, what they want to hear, and who else is talking to them.",
      },
      {
        title: "Positioning and strategy",
        desc: "Where you stand in the market, and the one-sentence reason to choose you.",
      },
      {
        title: "Brand world and tone of voice",
        desc: "The story, the founder story and the voice the brand speaks with everywhere.",
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
        desc: "Colors, typography, grid and components as one, with a brand guidelines document.",
      },
      {
        title: "Rebranding",
        desc: "Repositioning and refreshing an existing brand.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    essence: "craft.",
    intro:
      "Bespoke, animated sites built on Next.js and on the brand's foundations, lightning fast and *alive* under your hands.",
    teaser: ["Bespoke website", "Web design (UI/UX)", "Motion and animation"],
    subServices: [
      {
        title: "Bespoke website development",
        desc: "No templates, built for your brand.",
      },
      {
        title: "Web design (UI/UX)",
        desc: "An interface that's clear and converts.",
      },
      {
        title: "Motion and animation",
        desc: "GSAP, Lenis, motion that sets you apart.",
      },
      {
        title: "Website copy",
        desc: "Written from your positioning and your customers' own words.",
      },
      {
        title: "Landing and campaign pages",
        desc: "One goal, one message, maximum conversion.",
      },
      {
        title: "Multilingual sites",
        desc: "Every language your customers read.",
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
        title: "Maintenance plan",
        desc: "The site stays live, updated and secure.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce",
    essence: "sell.",
    intro:
      "Webshops that don't just look good but *convert*, from the product page to the invoice and the *returning* customer.",
    teaser: ["Webshop build", "Shop UX design", "Payment and invoicing"],
    subServices: [
      {
        title: "Webshop build",
        desc: "Our own webshop system with an admin you log in to, and a storefront made for your brand.",
      },
      {
        title: "Shop UX and product page design",
        desc: "The buying journey and product pages that lead to the cart.",
      },
      {
        title: "Catalogue upload and product copy",
        desc: "Your whole catalogue in, described in your customers' own words.",
      },
      {
        title: "Payment and shipping integration",
        desc: "Hungarian and international solutions wired in.",
      },
      {
        title: "Invoicing integration",
        desc: "Számlázz.hu, Billingo and international equivalents, hooked up automatically.",
      },
      {
        title: "Analytics and conversion tracking",
        desc: "Every sale traced back to where it came from.",
      },
      {
        title: "Shop upkeep and conversion optimization",
        desc: "After launch, a monthly funnel review and improvements shipped.",
      },
    ],
  },
  {
    slug: "software-solutions",
    title: "Software Solutions",
    essence: "ship.",
    intro:
      "Web apps, *iOS and Android* apps, portals and internal tools, from the same *DNA* we built our own platform from.",
    teaser: ["Web application", "Mobile app (iOS and Android)", "MVP development"],
    subServices: [
      {
        title: "Web application development",
        desc: "The SaaS, internal tool, portal or dashboard you need.",
      },
      {
        title: "Mobile app development (iOS and Android)",
        desc: "A thumb-first app, from idea to store launch.",
      },
      {
        title: "Product UI/UX design",
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
        title: "AI features",
        desc: "Assistants, search and summaries inside the software, where they help.",
      },
      {
        title: "Maintenance and further development",
        desc: "The product doesn't stop at launch.",
      },
    ],
  },
  {
    slug: "strategic-marketing",
    title: "Strategic Marketing",
    essence: "grow.",
    intro:
      "Where and why the brand shows up, across paid and organic channels, with *measurable* goals so it *grows*.",
    teaser: ["Channel strategy", "Paid advertising", "SEO"],
    subServices: [
      {
        title: "Campaign and channel strategy",
        desc: "A unified plan across channels, with measurable goals.",
      },
      {
        title: "Organic social strategy",
        desc: "The one channel where your customers are, and how to show up there.",
      },
      {
        title: "Paid advertising (Meta, Google)",
        desc: "Ads that bring revenue, not just clicks.",
      },
      {
        title: "SEO and content marketing",
        desc: "Ongoing discoverability in search and in AI answers.",
      },
      {
        title: "Email marketing",
        desc: "The list that stays yours, and turns into buyers.",
      },
      {
        title: "Tracking, reporting and strategy",
        desc: "Measured properly, reported monthly, with a strategy session.",
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
