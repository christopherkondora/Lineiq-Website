// Single source of truth for the service catalogue's structure. Drives the
// homepage index (WhatWeDo), each /services/[slug] category page and the
// redirects from retired slugs (serviceRedirects.ts).
// Content mirrors strategy/service_delivery.md in the Kontrast Vault: the five
// listed categories, in its order. Content Management is unlisted for Q4 2026
// (Service Delivery §2.2) and never appears here.
//
// What is here: the slugs, the order, the Kranky essence word (a mark, English
// in every language) and the order of each category's sub-services. What each
// one is called and says is in the dictionaries (services.categories), keyed by
// the slug and the sub-service ids below. localizedServices() joins the two.

import type { Dictionary } from "../i18n/dictionary";

type CategoryCopy = Dictionary["services"]["categories"];

/** A category's id is its slug. */
export type CategoryId = keyof CategoryCopy;

export interface ServiceCategory {
  slug: CategoryId;
  essence: string; // Kranky one-word signature
  subServices: readonly string[]; // ids, in reading order
}

/** Typed per category, so a sub-service id the dictionary lacks fails the build. */
function category<Id extends CategoryId>(c: {
  slug: Id;
  essence: string;
  subServices: readonly (keyof CategoryCopy[Id]["subServices"] & string)[];
}): ServiceCategory {
  return c;
}

export const services: ServiceCategory[] = [
  category({
    slug: "brand-architecture",
    essence: "soul.",
    subServices: [
      "research",
      "positioning",
      "brandWorld",
      "naming",
      "identity",
      "designSystem",
      "rebranding",
    ],
  }),
  category({
    slug: "web-development",
    essence: "craft.",
    subServices: [
      "bespokeSite",
      "webDesign",
      "motion",
      "copy",
      "landingPages",
      "multilingual",
      "cms",
      "performance",
      "maintenance",
    ],
  }),
  category({
    slug: "ecommerce",
    essence: "sell.",
    subServices: [
      "webshop",
      "shopUx",
      "catalogue",
      "paymentShipping",
      "invoicing",
      "analytics",
      "upkeep",
    ],
  }),
  category({
    slug: "software-solutions",
    essence: "ship.",
    subServices: [
      "webApp",
      "mobileApp",
      "productDesign",
      "mvp",
      "integration",
      "aiFeatures",
      "maintenance",
    ],
  }),
  category({
    slug: "strategic-marketing",
    essence: "grow.",
    subServices: [
      "channelStrategy",
      "organicSocial",
      "paidAds",
      "seo",
      "email",
      "reporting",
    ],
  }),
];

export function getService(slug: string): ServiceCategory | undefined {
  return services.find((s) => s.slug === slug);
}

export interface SubService {
  id: string;
  title: string;
  desc: string;
}

/** A category as a page shows it: the structure joined with one language's copy. */
export interface LocalizedCategory {
  slug: CategoryId;
  essence: string;
  title: string;
  intro: string;
  subServices: SubService[];
}

/** The catalogue in one language, in Service Delivery's order. */
export function localizedServices(copy: CategoryCopy): LocalizedCategory[] {
  return services.map((s) => {
    const c = copy[s.slug];
    const subCopy = c.subServices as Record<string, Omit<SubService, "id">>;
    return {
      slug: s.slug,
      essence: s.essence,
      title: c.title,
      intro: c.intro,
      subServices: s.subServices.map((id) => ({ id, ...subCopy[id] })),
    };
  });
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
