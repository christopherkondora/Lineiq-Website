import { notFound } from "next/navigation";
import ContactFlow from "./ContactFlow";
import Footer from "../../components/Footer";
import { getDictionary } from "../../i18n/dictionary";
import { isLocale } from "../../i18n/routing";
import { metadataFor } from "../../i18n/seo";

export const generateMetadata = metadataFor("/contact");

// No footer. The flow owns the viewport and nothing on this route scrolls, so
// anything under the fold would be a second page the wheel has to fight the
// camera to reach. The footer comes back with the confirmation, where leaving
// is the point. See [[contact/ContactFlow]].
export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <main>
      <ContactFlow t={dict.contact} footer={<Footer t={dict.footer} />} />
    </main>
  );
}
