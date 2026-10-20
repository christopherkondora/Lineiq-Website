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
              onClick={onNavigate}
            >
              {localeNames[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
