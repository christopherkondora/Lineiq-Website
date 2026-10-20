import type { Locale } from "./routing";
import en, { type Dictionary } from "./dictionaries/en";
import hu from "./dictionaries/hu";
import de from "./dictionaries/de";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { en, hu, de };

/**
 * Read by server components only. Client components get their strings as
 * props, so no dictionary is ever shipped to the browser.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
