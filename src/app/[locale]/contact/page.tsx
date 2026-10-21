import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactFlow from "./ContactFlow";
import Footer from "../../components/Footer";
import { getDictionary } from "../../i18n/dictionary";
import { isLocale } from "../../i18n/routing";

export const metadata: Metadata = {
  title: "Contact — LineiQ",
  description:
    "Five questions, mostly answered by clicking. Tell us where you are and we will tell you straight whether we are the studio for it.",
};

// No footer. The flow owns the viewport and nothing on this route scrolls, so
// anything under the fold would be a second page the wheel has to fight the
// camera to reach. The footer comes back with the confirmation, where leaving
// is the point. See [[contact/ContactFlow]].
export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main>
      <ContactFlow footer={<Footer t={getDictionary(locale).footer} />} />
    </main>
  );
}
