"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "../i18n/LocaleProvider";
import {
  localeNames,
  locales,
  localizePath,
  stripLocale,
} from "../i18n/routing";
import { localeCookie } from "../i18n/rememberedLocale";
import styles from "./LanguageSwitcher.module.css";

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
 * A click also remembers the choice (rememberedLocale.ts), before the
 * navigation starts, so the request for a plain address already carries
 * English. The links are not prefetched: a prefetch made while the cookie
 * still said Hungarian would be the redirect to /hu, and choosing English
 * would land back there.
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
            <Link
              href={localizePath(page, locale)}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? "true" : undefined}
              className={styles.link}
              prefetch={false}
              onClick={() => {
                document.cookie = localeCookie(
                  locale,
                  window.location.protocol === "https:"
                );
                onNavigate?.();
              }}
            >
              {localeNames[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
