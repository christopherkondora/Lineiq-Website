import { describe, expect, it } from "vitest";
import { parseDraft } from "@/app/[locale]/contact/draft";

const full = {
  company: "Acme",
  email: "a@acme.hu",
  stage: "selling-well",
  need: "grow",
  budgetMode: "one-time",
  band: "ot-15-30k",
  note: "hello",
  at: 6,
};

describe("the contact draft kept across the privacy link", () => {
  it("restores a complete draft on the panel it was left", () => {
    expect(parseDraft(JSON.stringify(full))).toEqual(full);
  });

  it("returns nothing for missing, broken or empty storage", () => {
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft("not json")).toBeNull();
    expect(parseDraft("42")).toBeNull();
    expect(
      parseDraft(
        JSON.stringify({
          ...full,
          company: "",
          email: "",
          stage: null,
          need: null,
          band: null,
          note: "",
          at: 0,
        }),
      ),
    ).toBeNull();
  });

  it("drops ids the intake does not know", () => {
    const d = parseDraft(JSON.stringify({ ...full, stage: "rich", need: 3 }));
    expect(d?.stage).toBeNull();
    expect(d?.need).toBeNull();
  });

  it("drops a band that belongs to the other budget mode", () => {
    const d = parseDraft(JSON.stringify({ ...full, budgetMode: "monthly" }));
    expect(d?.band).toBeNull();
  });

  it("never lands past what the answers have earned", () => {
    expect(
      parseDraft(JSON.stringify({ ...full, email: "nope", at: 6 }))?.at,
    ).toBe(1);
    expect(
      parseDraft(JSON.stringify({ ...full, stage: null, at: 5 }))?.at,
    ).toBe(2);
    expect(parseDraft(JSON.stringify({ ...full, at: 99 }))?.at).toBe(6);
    expect(parseDraft(JSON.stringify({ ...full, at: -4 }))?.at).toBe(0);
  });
});
