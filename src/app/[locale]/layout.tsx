import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RootDocument, { rootMetadata } from "../components/RootDocument";
import { defaultLocale, isLocale, locales } from "../i18n/routing";

// Root layout of every visitor page. The segment is the locale: "en" is only
// ever reached through the proxy's rewrite of the plain address, "hu" and "de"
// are in the URL. The proxy sends every other first segment to en, so the
// guard below is a backstop. No `dynamicParams = false` here: it would 404 the
// [...missing] catch-all before it renders, and the 404 would lose this shell.
export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return rootMetadata(isLocale(locale) ? locale : defaultLocale);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <RootDocument locale={locale}>{children}</RootDocument>;
}
