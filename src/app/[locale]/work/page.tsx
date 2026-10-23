import { Fragment } from "react";
import { notFound } from "next/navigation";
import Placeholder from "../../components/Placeholder";
import Footer from "../../components/Footer";
import { getDictionary } from "../../i18n/dictionary";
import { isLocale } from "../../i18n/routing";
import { metadataFor } from "../../i18n/seo";

export const generateMetadata = metadataFor("/work");

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.work;

  return (
    <main>
      <Placeholder
        t={dict.placeholder}
        label={`◆ ${t.label}`}
        title={t.titleLines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
        signature="proof."
        lede={t.lede}
        nextStep={t.status}
        eta={t.launch}
      />
      <Footer t={dict.footer} />
    </main>
  );
}
