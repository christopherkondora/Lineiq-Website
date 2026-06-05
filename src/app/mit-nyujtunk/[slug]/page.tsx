import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService, plainIntro } from "../../data/services";
import CategoryArticle from "./CategoryArticle";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} — LineiQ`,
    description: plainIntro(service.intro),
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  return <CategoryArticle index={index} />;
}
