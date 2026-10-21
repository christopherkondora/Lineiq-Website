import { describe, expect, it } from "vitest";
import {
  FOUNDERS,
  ageSentence,
  founderInitials,
  founderName,
  getFounder,
} from "@/app/data/founders";
import { FRAMEWORK_IDS } from "@/app/data/method";
import { dictionaries } from "@/app/i18n/dictionary";
import { format } from "@/app/i18n/format";
import { locales } from "@/app/i18n/routing";

describe("filling a dictionary string", () => {
  it("fills every slot", () => {
    expect(format("Five of {frameworks}, across {layers} layers.", {
      frameworks: 22,
      layers: 11,
    })).toBe("Five of 22, across 11 layers.");
  });

  it("leaves a slot with no value as written", () => {
    expect(format("We are {younger} and {older}.", { younger: 19 })).toBe(
      "We are 19 and {older}."
    );
  });
});

describe("the founders' names", () => {
  const kristof = getFounder("kondora-kristof");
  const aron = getFounder("suto-aron");

  it("put the family name first in Hungarian", () => {
    expect(founderName(kristof, "hu")).toBe("Kondora Kristóf");
    expect(founderName(aron, "hu")).toBe("Sütő Áron");
  });

  it("put the given name first in English and German", () => {
    for (const locale of ["en", "de"] as const) {
      expect(founderName(kristof, locale)).toBe("Kristóf Kondora");
      expect(founderName(aron, locale)).toBe("Áron Sütő");
    }
  });

  it("give initials in the order the name is written", () => {
    expect(founderInitials(aron, "hu")).toBe("SÁ");
    expect(founderInitials(aron, "en")).toBe("ÁS");
  });

  it.each(locales)("each have four rows in %s", (locale) => {
    for (const f of FOUNDERS) {
      expect(dictionaries[locale].about.founders.lines[f.id]).toHaveLength(4);
    }
  });
});

describe("the age sentence", () => {
  const t = dictionaries.en.about.record;

  it("states one age when both founders share it", () => {
    expect(ageSentence([19, 19], t)).toBe("We are both 19.");
  });

  it("states both ages, younger first, on the day they differ", () => {
    expect(ageSentence([20, 19], t)).toBe("We are 19 and 20.");
  });
});

describe("the frameworks", () => {
  it.each(locales)("every framework has its words in %s", (locale) => {
    const words = dictionaries[locale].about.founders.frameworks;
    expect(Object.keys(words).sort()).toEqual([...FRAMEWORK_IDS].sort());
  });
});
