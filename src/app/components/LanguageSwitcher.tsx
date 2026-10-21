"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "../i18n/LocaleProvider";
import {
  localeNames,
  locales,
  localizePath,
  stripLocale,
  type Locale,
} from "../i18n/routing";
import { localeCookie } from "../i18n/rememberedLocale";
import styles from "./LanguageSwitcher.module.css";

function remember(locale: Locale) {
  document.cookie = localeCookie(locale, window.location.protocol === "https:");
}

interface LanguageSwitcherProps {
  label: string;
  className?: string;
  onNavigate?: () => void;
}

/**
 * English, Magyar, Deutsch, each named in its own language. Every entry points
 * to the page the visitor is on, in that language. The pathname is stripped
 * of its locale first, so the server render (which sees the rewritten /en/...)
 * and the browser (which sees the plain address) agree.
 *
 * Choosing also remembers the choice (rememberedLocale.ts), on a click and on
 * a middle click, before the browser leaves, so the request for a plain
 * address already carries the new language. The entries are plain anchors,
 * not next/link: a language change is a full page load, so no prefetch or
 * router cache made under the old cookie (the redirect to /hu) can answer
 * it. A tab opened from the context menu carries the old cookie: there is no
 * event for it.
 */
export default function LanguageSwitcher({
  label,
  className,
  onNavigate,
}: LanguageSwitcherProps) {
  const current = useLocale();
  const page = stripLocale(usePathname());

  return (
    <nav aria-label={label} className={className}>
      <ul className={styles.list}>
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={localizePath(page, locale)}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? "true" : undefined}
              className={styles.link}
              onClick={() => {
                remember(locale);
                onNavigate?.();
              }}
              onAuxClick={() => remember(locale)}
            >
              {localeNames[locale]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
