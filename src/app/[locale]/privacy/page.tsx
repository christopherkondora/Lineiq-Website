import { notFound } from "next/navigation";
import LegalPage from "../../components/LegalPage";
import { isLocale } from "../../i18n/routing";
import { metadataFor } from "../../i18n/seo";

export const generateMetadata = metadataFor("/privacy");

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalPage kind="privacy" locale={locale} />;
}
