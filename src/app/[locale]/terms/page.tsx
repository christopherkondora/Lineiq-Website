import { notFound } from "next/navigation";
import LegalPage from "../../components/LegalPage";
import { isLocale } from "../../i18n/routing";
import { metadataFor } from "../../i18n/seo";

export const generateMetadata = metadataFor("/terms");

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalPage kind="terms" locale={locale} />;
}
