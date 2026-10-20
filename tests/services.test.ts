import { describe, expect, it } from "vitest";
import { getService, services } from "@/app/data/services";
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

  it("names nothing LineiQ does not sell", () => {
    const text = JSON.stringify(services).toLowerCase();
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
