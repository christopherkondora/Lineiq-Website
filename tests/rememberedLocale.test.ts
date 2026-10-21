import { describe, expect, it } from "vitest";
import {
  LOCALE_COOKIE,
  localeCookie,
  rememberedLocale,
} from "@/app/i18n/rememberedLocale";

describe("reading the remembered language", () => {
  it("reads a locale code", () => {
    expect(rememberedLocale("hu")).toBe("hu");
    expect(rememberedLocale("de")).toBe("de");
    expect(rememberedLocale("en")).toBe("en");
  });

  it("ignores a missing cookie", () => {
    expect(rememberedLocale(undefined)).toBeNull();
  });

  it("ignores anything that is not one of the site's languages", () => {
    expect(rememberedLocale("")).toBeNull();
    expect(rememberedLocale("fr")).toBeNull();
    expect(rememberedLocale("HU")).toBeNull();
    expect(rememberedLocale("hu-HU")).toBeNull();
  });
});

describe("writing the remembered language", () => {
  it("is one first-party cookie for the whole site, kept for a year", () => {
    expect(localeCookie("hu", true)).toBe(
      `${LOCALE_COOKIE}=hu; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
    );
  });

  it("drops Secure where the page is not served over https", () => {
    expect(localeCookie("de", false)).toBe(
      `${LOCALE_COOKIE}=de; Path=/; Max-Age=31536000; SameSite=Lax`
    );
  });

  it("round-trips through the reader", () => {
    const value = localeCookie("hu", true).split(";")[0].split("=")[1];
    expect(rememberedLocale(value)).toBe("hu");
  });
});
