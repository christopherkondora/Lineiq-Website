import { describe, expect, it } from "vitest";
import {
  alternates,
  isPrivatePath,
  localeOf,
  localeRedirectRules,
  localizePath,
  routeRequest,
  stripLocale,
} from "@/app/i18n/routing";
import { dictionaries } from "@/app/i18n/dictionary";

describe("locale detection", () => {
  it("reads the locale from the first segment", () => {
    expect(localeOf("/hu")).toBe("hu");
    expect(localeOf("/hu/about")).toBe("hu");
    expect(localeOf("/de/services/ecommerce")).toBe("de");
    expect(localeOf("/en/about")).toBe("en");
  });

  it("treats an unprefixed path as English", () => {
    expect(localeOf("/")).toBe("en");
    expect(localeOf("/about")).toBe("en");
  });

  it("needs a whole segment, not a prefix of one", () => {
    expect(localeOf("/hungary")).toBe("en");
    expect(localeOf("/design")).toBe("en");
  });

  it("ignores the query and the hash", () => {
    expect(localeOf("/de?x=1")).toBe("de");
    expect(localeOf("/hu#services")).toBe("hu");
  });
});

describe("stripping the locale", () => {
  it("removes the prefix", () => {
    expect(stripLocale("/hu/about")).toBe("/about");
    expect(stripLocale("/de/services/web-development")).toBe(
      "/services/web-development"
    );
    expect(stripLocale("/en/contact")).toBe("/contact");
  });

  it("leaves the home page as /", () => {
    expect(stripLocale("/hu")).toBe("/");
    expect(stripLocale("/en")).toBe("/");
  });

  it("leaves unprefixed paths alone", () => {
    expect(stripLocale("/")).toBe("/");
    expect(stripLocale("/about")).toBe("/about");
    expect(stripLocale("/hungary")).toBe("/hungary");
  });

  it("keeps the query and the hash", () => {
    expect(stripLocale("/hu?x=1")).toBe("/?x=1");
    expect(stripLocale("/de/about#founders")).toBe("/about#founders");
  });
});

describe("a path in another locale", () => {
  it("prefixes Hungarian and German, never English", () => {
    expect(localizePath("/about", "hu")).toBe("/hu/about");
    expect(localizePath("/about", "de")).toBe("/de/about");
    expect(localizePath("/about", "en")).toBe("/about");
  });

  it("puts the home page at the bare prefix", () => {
    expect(localizePath("/", "hu")).toBe("/hu");
    expect(localizePath("/", "de")).toBe("/de");
    expect(localizePath("/", "en")).toBe("/");
  });

  it("moves between locales from any starting locale", () => {
    expect(localizePath("/hu/contact", "de")).toBe("/de/contact");
    expect(localizePath("/de/contact", "en")).toBe("/contact");
    expect(localizePath("/de", "hu")).toBe("/hu");
  });

  it("collapses /en to the plain address", () => {
    expect(localizePath("/en", "en")).toBe("/");
    expect(localizePath("/en/about", "en")).toBe("/about");
    expect(localizePath("/en/about", "hu")).toBe("/hu/about");
  });

  it("keeps anchors and queries", () => {
    expect(localizePath("/#services", "hu")).toBe("/hu#services");
    expect(localizePath("/about#founders", "de")).toBe("/de/about#founders");
    expect(localizePath("/contact?mode=company", "hu")).toBe(
      "/hu/contact?mode=company"
    );
  });

  it("leaves what is not a site path alone", () => {
    expect(localizePath("#services", "hu")).toBe("#services");
    expect(localizePath("mailto:hello@lineiqgroup.com", "hu")).toBe(
      "mailto:hello@lineiqgroup.com"
    );
    expect(localizePath("https://example.com/about", "de")).toBe(
      "https://example.com/about"
    );
    expect(localizePath("//example.com", "de")).toBe("//example.com");
  });
});

describe("private routes", () => {
  it("knows the working routes", () => {
    expect(isPrivatePath("/styleguide")).toBe(true);
    expect(isPrivatePath("/preloader?mode=scrub")).toBe(true);
    expect(isPrivatePath("/about")).toBe(false);
    expect(isPrivatePath("/styleguides")).toBe(false);
  });

  it("are never localised", () => {
    expect(localizePath("/styleguide", "hu")).toBe("/styleguide");
    expect(localizePath("/preloader", "de")).toBe("/preloader");
  });

  it("have no alternates", () => {
    expect(alternates("/styleguide")).toBeNull();
    expect(alternates("/preloader")).toBeNull();
  });
});

describe("the alternates set", () => {
  it("lists every locale and x-default, the English", () => {
    expect(alternates("/about")).toEqual({
      en: "/about",
      hu: "/hu/about",
      de: "/de/about",
      "x-default": "/about",
    });
  });

  it("is the same set from every language version of a page", () => {
    expect(alternates("/hu/about")).toEqual(alternates("/about"));
    expect(alternates("/de/about")).toEqual(alternates("/about"));
  });

  it("covers the home page", () => {
    expect(alternates("/")).toEqual({
      en: "/",
      hu: "/hu",
      de: "/de",
      "x-default": "/",
    });
  });

  it("drops the query and the hash", () => {
    expect(alternates("/about?x=1#founders")).toEqual(alternates("/about"));
  });
});

describe("what the proxy does", () => {
  it("serves the plain address from the internal en segment", () => {
    expect(routeRequest("/")).toEqual({ action: "rewrite", to: "/en" });
    expect(routeRequest("/about")).toEqual({
      action: "rewrite",
      to: "/en/about",
    });
    expect(routeRequest("/hungary")).toEqual({
      action: "rewrite",
      to: "/en/hungary",
    });
  });

  it("passes /en through, which the config redirect collapses first", () => {
    expect(routeRequest("/en")).toEqual({ action: "next" });
    expect(routeRequest("/en/about")).toEqual({ action: "next" });
  });

  it("passes /hu and /de through", () => {
    expect(routeRequest("/hu")).toEqual({ action: "next" });
    expect(routeRequest("/de/about")).toEqual({ action: "next" });
  });

  it("passes the private routes through at their own address", () => {
    expect(routeRequest("/styleguide")).toEqual({ action: "next" });
    expect(routeRequest("/preloader")).toEqual({ action: "next" });
  });
});

describe("the /en collapse", () => {
  it("308s /en and everything under it to the plain address", () => {
    expect(localeRedirectRules()).toEqual([
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ]);
  });
});

/** Every leaf key of a dictionary, as dotted paths. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe("dictionaries", () => {
  const source = keyPaths(dictionaries.en).sort();

  it.each(["hu", "de"] as const)(
    "%s has exactly the keys of en, nothing missing, nothing extra",
    (locale) => {
      expect(keyPaths(dictionaries[locale]).sort()).toEqual(source);
    }
  );

  it.each(["en", "hu", "de"] as const)("%s has no empty strings", (locale) => {
    const text = JSON.stringify(dictionaries[locale]);
    expect(text).not.toContain('""');
  });
});
