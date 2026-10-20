import type { Dictionary } from "./en";

// Typed against the English, so a missing or extra key fails the type check.
// Holds the English until the translation slice (Lineiq-Website#17).
const de: Dictionary = {
  home: {
    close: {
      headline: "Ready?",
      cta: "Let's begin.",
      ctaHover: "Let's go!",
    },
  },
  languageSwitcher: {
    label: "Language",
  },
};

export default de;
