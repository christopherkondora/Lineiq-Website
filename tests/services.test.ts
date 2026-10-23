import { describe, expect, it } from "vitest";
import {
  getService,
  localizedServices,
  services,
} from "@/app/data/services";
import { dictionaries } from "@/app/i18n/dictionary";
import { locales } from "@/app/i18n/routing";
import {
  serviceRedirectRules,
  serviceRedirects,
} from "@/app/data/serviceRedirects";

describe("service catalogue", () => {
  it("lists exactly the five categories, in Service Delivery's order", () => {
    expect(services.map((s) => s.slug)).toEqual([
      "brand-architecture",
      "web-development",
      "ecommerce",
      "software-solutions",
      "strategic-marketing",
    ]);
  });

  it.each(locales)("names nothing LineiQ does not sell, in %s", (locale) => {
    const text = JSON.stringify(
      localizedServices(dictionaries[locale].services.categories)
    ).toLowerCase();
    for (const term of [
      "content management",
      "packaging",
      "automation",
      "sms",
      "rev-share",
      "shopify",
    ]) {
      expect(text, term).not.toContain(term);
    }
  });

  // Technical SEO is part of a website build (Web Development); SEO as an
  // ongoing service, rankings or AI-answer visibility is not sold
  // (kontrast-vault#48).
  it.each(locales)("sells no SEO beyond the technical setup, in %s", (locale) => {
    const marketing = JSON.stringify(
      dictionaries[locale].services.categories["strategic-marketing"]
    ).toLowerCase();
    expect(marketing).not.toContain("seo");
    const all = JSON.stringify(
      localizedServices(dictionaries[locale].services.categories)
    ).toLowerCase();
    for (const term of ["content marketing", "ai answers", "aeo", "geo"]) {
      expect(all, term).not.toMatch(new RegExp(`\\b${term}\\b`));
    }
  });
});

describe("the catalogue in a language", () => {
  it.each(locales)(
    "%s has copy for exactly the categories in the catalogue",
    (locale) => {
      expect(
        Object.keys(dictionaries[locale].services.categories).sort()
      ).toEqual(services.map((s) => s.slug).sort());
    }
  );

  it.each(locales)(
    "%s has copy for exactly each category's sub-services, nothing extra",
    (locale) => {
      for (const s of services) {
        const copy = dictionaries[locale].services.categories[s.slug];
        expect(Object.keys(copy.subServices).sort(), s.slug).toEqual(
          [...s.subServices].sort()
        );
      }
    }
  );

  it("keeps the catalogue's order and takes the words from the dictionary", () => {
    const en = localizedServices(dictionaries.en.services.categories);
    expect(en.map((c) => c.slug)).toEqual(services.map((s) => s.slug));
    expect(en[0].title).toBe("Brand Architecture");
    expect(en[0].essence).toBe("soul.");
    expect(en[0].subServices.map((ss) => ss.id)).toEqual(
      services[0].subServices
    );
    expect(en[0].subServices[3]).toEqual({
      id: "naming",
      title: "Naming",
      desc: "Company, product and campaign names that stick.",
    });
  });

  it("follows the dictionary it is given", () => {
    const copy = structuredClone(dictionaries.en.services.categories);
    copy.ecommerce.title = "Webshop";
    copy.ecommerce.subServices.webshop.desc = "Ours.";
    const ecommerce = localizedServices(copy)[2];
    expect(ecommerce.title).toBe("Webshop");
    expect(ecommerce.subServices[0].desc).toBe("Ours.");
  });
});

describe("service redirects", () => {
  it("sends every old slug to a live category", () => {
    for (const [from, to] of Object.entries(serviceRedirects)) {
      expect(getService(to), `${from} -> ${to}`).toBeDefined();
    }
  });

  it("never redirects a live slug", () => {
    for (const s of services) {
      expect(serviceRedirects[s.slug], s.slug).toBeUndefined();
    }
  });

  it("covers the three retired slugs", () => {
    expect(serviceRedirects).toEqual({
      "brand-building": "brand-architecture",
      "mobile-apps": "software-solutions",
      marketing: "strategic-marketing",
    });
  });

  it("turns each entry into a permanent redirect under /services, in every locale", () => {
    for (const prefix of ["", "/hu", "/de"]) {
      expect(serviceRedirectRules()).toContainEqual({
        source: `${prefix}/services/mobile-apps`,
        destination: `${prefix}/services/software-solutions`,
        permanent: true,
      });
    }
    expect(serviceRedirectRules()).toHaveLength(
      Object.keys(serviceRedirects).length * 3
    );
  });
});
