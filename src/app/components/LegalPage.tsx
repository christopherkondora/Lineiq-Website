import Link from "next/link";
import Footer from "./Footer";
import styles from "./LegalPage.module.css";
import { getDictionary } from "../i18n/dictionary";
import type { Locale } from "../i18n/routing";
import {
  BINDING_LOCALE,
  legalPage,
  linkify,
  type LegalBlock,
  type LegalKind,
} from "../data/legal";

// /terms and /privacy, one page in three languages (Lineiq-Website#14). A
// server component on purpose: the documents are long, and none of their text
// goes to the browser as JavaScript. The footer is the only client part, and
// it gets its own dictionary slice as props, as everywhere else.
//
// The page is for reading, not for the scroll set pieces: one column at a
// reading measure, the house type, no motion.

function Text({ text }: { text: string }) {
  return (
    <>
      {linkify(text).map((segment, i) =>
        "href" in segment ? (
          <a key={i} href={segment.href} className={styles.inlineLink}>
            {segment.text}
          </a>
        ) : (
          segment.text
        )
      )}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p className={styles.paragraph}>
        <Text text={block} />
      </p>
    );
  }
  if ("list" in block) {
    return (
      <ul className={styles.list}>
        {block.list.map((item, i) => (
          <li key={i}>
            <Text text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <dl className={styles.facts}>
      {block.facts.map(([label, value]) => (
        <div key={label} className={styles.fact}>
          <dt>{label}</dt>
          <dd>
            <Text text={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function LegalPage({
  kind,
  locale,
}: {
  kind: LegalKind;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const page = legalPage(kind, locale);

  return (
    <main>
      <article className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <header className={styles.header}>
            <p className="text-label">◆ {page.label}</p>
            <h1 className={`text-section ${styles.title}`}>
              {page.document.title}
            </h1>
            <p className={styles.version}>{page.versionLine}</p>
            <p className={styles.languageNote}>
              {page.languageNote}
              {page.original && (
                <>
                  {" "}
                  <Link
                    href={page.original.href}
                    hrefLang={BINDING_LOCALE}
                    className={styles.inlineLink}
                  >
                    {page.original.label}&nbsp;→
                  </Link>
                </>
              )}
            </p>
          </header>

          {page.document.sections.map((section, i) => (
            <section
              key={section.heading}
              className={styles.section}
              aria-labelledby={`${kind}-${i + 1}`}
            >
              <h2 id={`${kind}-${i + 1}`} className={styles.heading}>
                <span className={styles.number}>{i + 1}.</span>{" "}
                {section.heading}
              </h2>
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}
        </div>
      </article>
      <Footer t={dict.footer} />
    </main>
  );
}
