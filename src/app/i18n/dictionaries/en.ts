// The English dictionary: the source every other language is typed against.
// Strings move in here unchanged, slice by slice (Lineiq-Website#6, #7, #8);
// the copy itself is rewritten later in one pass (#15).
//
// The Kranky signature words ("soul.", "craft.", "noise off.") are marks, not
// copy: they stay English in every language and are not keyed here.

const en = {
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

export type Dictionary = typeof en;

export default en;
