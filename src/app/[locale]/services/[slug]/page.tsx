import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  services,
  localizedServices,
  plainIntro,
} from "../../../data/services";
import { getDictionary } from "../../../i18n/dictionary";
import { isLocale } from "../../../i18n/routing";
import Footer from "../../../components/Footer";
import CategoryArticle from "./CategoryArticle";

type Params = PageProps<"/[locale]/services/[slug]">;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const category = localizedServices(
    getDictionary(locale).services.categories
  ).find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.title} — LineiQ`,
    description: plainIntro(category.intro),
  };
}

export default async function CategoryPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  // The page's frame apart from the catalogue, which goes in already joined.
  const { categories: copy, ...t } = dict.services;
  const categories = localizedServices(copy);
  const index = categories.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  return (
    <CategoryArticle
      categories={categories}
      index={index}
      t={t}
      footer={<Footer t={dict.footer} />}
    />
  );
}
