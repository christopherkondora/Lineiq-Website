"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "../i18n/LocaleProvider";
import { localizePath } from "../i18n/routing";

/**
 * next/link that keeps the visitor in their language: "/contact" on a
 * Hungarian page points to "/hu/contact". Every internal link on a visitor
 * page goes through this, so a page never falls back into English mid-visit.
 */
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  return (
    <Link
      href={typeof href === "string" ? localizePath(href, locale) : href}
      {...rest}
    />
  );
}
