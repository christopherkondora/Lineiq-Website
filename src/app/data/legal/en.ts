import { COMPANY, HOST } from "../company";
import type { Fact, LegalTexts } from "./types";

// A translation of ./hu, block for block. The Hungarian binds; where this
// says something different, this is what changes.

const company: readonly Fact[] = [
  ["Registered name", COMPANY.legalName],
  ["Short name", COMPANY.name],
  ["Registered seat", COMPANY.seat],
  ["Company registration number", COMPANY.registrationNumber],
  ["Court of registration", COMPANY.registryCourt],
  ["Tax number", COMPANY.taxNumber],
  [
    "Represented by",
    "Kristóf Máté Kondora and Áron Sütő, managing directors, each alone",
  ],
  ["Email", COMPANY.email],
];

const en: LegalTexts = {
  chrome: {
    label: "Legal",
    languageNote:
      "This is an English translation, for information. The Hungarian text is the binding one and prevails wherever the two differ.",
    original: "Read the Hungarian original",
    versionLine: "Version {version} · in force from {date}",
  },

  terms: {
    title: "Terms of Use",
    sections: [
      {
        heading: "Who runs this site",
        blocks: [
          "The website www.lineiqgroup.com (the website) is operated by the following company (LineiQ, we or us):",
          { facts: company },
          "The website is hosted by:",
          {
            facts: [
              ["Name", HOST.name],
              ["Address", HOST.address],
              ["Email", HOST.email],
            ],
          },
          "We publish these details under Section 4 of Act CVIII of 2001 on electronic commerce services and certain aspects of information society services (the E-Commerce Act).",
        ],
      },
      {
        heading: "Scope",
        blocks: [
          "These terms apply to every visitor of the website and to every language version of it. By using the website you accept them; if you do not agree with them, please do not use the website.",
          "These terms govern the use of the website. We provide our services only under a separate contract concluded in writing, and any such engagement is governed by that contract.",
        ],
      },
      {
        heading: "The website is not an offer",
        blocks: [
          "The descriptions, processes, examples and budget ranges on the website are for information. They are not an offer and do not create a contract. We make an offer only in writing, after talking with you.",
          "Nothing can be ordered or bought through the website, so using it creates no obligation to pay.",
        ],
      },
      {
        heading: "The contact form",
        blocks: [
          {
            list: [
              "Sending the form is an enquiry, not an order: it creates no contract and no obligation on your side.",
              "Every enquiry is read by a person, and we answer it by email. We reserve the right not to take on work on the basis of an enquiry.",
              "Please give accurate details, and do not send confidential business information through the form, or anyone else's personal data without their consent.",
              "How the details you give in the form are handled is set out in the Privacy Notice.",
            ],
          },
        ],
      },
      {
        heading: "Intellectual property",
        blocks: [
          "All content of the website (texts, graphics, images, animations, the website's design and source code, the LineiQ name and logo) is protected by Act LXXVI of 1999 on copyright and other laws. The rights belong to LineiQ or to the content's other rights holder.",
          "You may view the content for your own, non-commercial information, and quote it with the source named, to the extent the law allows. Any other use, in particular copying, adapting, communicating to the public and commercial use, needs our prior written permission.",
          "The names and marks of the clients and partners mentioned on the website belong to their owners; mentioning them transfers no rights.",
        ],
      },
      {
        heading: "Using the website",
        blocks: [
          "You may not use the website unlawfully or in a way that endangers its operation. This includes in particular breaking into or overloading the website or the systems behind it, placing malicious code, and sending unsolicited or automated messages through the form.",
        ],
      },
      {
        heading: "Liability",
        blocks: [
          "We aim to keep the website's content accurate and up to date, and the website available at all times, but we cannot guarantee either. The content is general information, not individual professional advice.",
          "To the fullest extent the law permits, we exclude liability for damage arising from the use of the website, its unavailability, or decisions based on its content. This does not apply to liability for damage caused intentionally, or for a breach of contract that harms human life, physical integrity or health, which under Section 6:152 of Act V of 2013 on the Civil Code (the Civil Code) cannot be excluded.",
          "Where the website links to other websites, the operator of each such website is responsible for its content and for the data processing there.",
        ],
      },
      {
        heading: "Governing law and disputes",
        blocks: [
          "These terms are governed by Hungarian law, in particular the Civil Code and the E-Commerce Act. If you are a consumer, this does not deprive you of the protection of the law of the country where you habitually reside that cannot be derogated from by contract.",
          "We settle disagreements by talking first; please write to us at hello@lineiqgroup.com. If that does not resolve the matter, the Hungarian courts have jurisdiction over the dispute, without prejudice to the mandatory rules of jurisdiction that protect consumers.",
        ],
      },
      {
        heading: "Language",
        blocks: [
          "These terms were written in Hungarian. Their English and German translations are for information; wherever they differ, the Hungarian text prevails.",
        ],
      },
      {
        heading: "Changes to these terms",
        blocks: [
          "We may change these terms; a change takes effect when it is published on the website. The version in force is always on this page, with its version number and the date it took effect at the top.",
          "Questions are welcome: hello@lineiqgroup.com.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Notice",
    sections: [
      {
        heading: "The controller",
        blocks: [
          "The controller of the personal data described in this notice is (LineiQ, we or us):",
          { facts: company },
          "Contact for anything about your data: **contact@lineiqgroup.com**. We are not required to appoint a data protection officer and have not appointed one.",
        ],
      },
      {
        heading: "What this notice covers",
        blocks: [
          "Under Articles 13 and 14 of Regulation (EU) 2016/679 (the General Data Protection Regulation, GDPR) and Act CXII of 2011 on informational self-determination and freedom of information (the Info Act), this notice explains which personal data we handle as controller, where it comes from, for what purpose, on what legal basis and for how long, who receives it, and what rights you have. It covers you if you:",
          {
            list: [
              "visit www.lineiqgroup.com or write to us through its form or by email;",
              "are a person at a business we have found and may contact (a prospect);",
              "contact us or are contacted by us on a social media platform;",
              "work for a partner of ours, or sign an agreement with us;",
              "receive an invoice from us or send us one.",
            ],
          },
          "It does not cover the personal data of a partner's own customers, leads or staff that we handle on the partner's instructions during a project. For that data the partner is the controller, and its own privacy notice applies; our role is set out in our data processing agreement with the partner.",
        ],
      },
      {
        heading: "In short",
        blocks: [
          {
            list: [
              "We handle business contact details and what you tell us, nothing more.",
              "About prospects, we use only information that is public, and we tell you at the latest in our first message.",
              "We do not sell your data, and we do not pass it to anyone for their marketing.",
              "No decision about you is made automatically.",
              "The website uses no analytics or tracking, and one cookie only if you choose a language.",
            ],
          },
        ],
      },
      {
        heading: "Enquiries through the website and by email",
        blocks: [
          "The form on the Contact page lets you ask for an offer or to work with us. If you write to us by email, the same applies.",
          {
            facts: [
              [
                "Data",
                "The company name, the email address, your answers to the form's questions (where the business stands, the service needed, the budget range), the optional note, the language of the page; or what your email contains. The company name and email address are personal data when they identify a person, for example a sole trader's name or an email address in a person's name.",
              ],
              [
                "Purpose",
                "To answer your enquiry, judge whether our services fit, and talk before a contract.",
              ],
              [
                "Legal basis",
                "Article 6(1)(b) GDPR: steps taken at your request before a contract. If you write as the representative or employee of a company: Article 6(1)(f) GDPR, our legitimate interest in answering business enquiries.",
              ],
              [
                "Kept for",
                "12 months from the last message if no contract follows. If one does, section 6 applies.",
              ],
              [
                "Must you give it?",
                "No. Without the company name and email address we cannot reply, so the form cannot be sent without them.",
              ],
            ],
          },
          "The website does not store the form in a database: it arrives in our mailbox as an email. To filter out automated submissions, the form checks a hidden field and how long it took to fill in; we derive and store no personal data from these.",
        ],
      },
      {
        heading: "Prospects: businesses we find ourselves",
        blocks: [
          "We look for businesses that may need our services, and contact the people who run them.",
          {
            facts: [
              [
                "Data",
                "Name, role, business email address and business phone number, the company, links to public business profiles, where we found the information, our short notes on whether our services could fit the business, and our messages with you.",
              ],
              [
                "Where it comes from",
                "Public sources only: the company's website, public business profiles and pages (for example LinkedIn, Instagram, Facebook, YouTube, TikTok, Substack), company registers, press and recommendations from people who know you.",
              ],
              [
                "Purpose",
                "To find businesses we may be able to help, and contact them about working with us.",
              ],
              [
                "Legal basis",
                "Article 6(1)(f) GDPR: our legitimate interest in finding clients for our business. We have weighed it against your interests and recorded the assessment; you can ask for it at contact@lineiqgroup.com.",
              ],
              [
                "When we tell you",
                "At the latest in our first message to you, and in any case within one month of finding your details. If we decide not to contact you, we delete your details within that month and keep only the company's name and our reason.",
              ],
              [
                "Kept for",
                "12 months from our last exchange if no cooperation follows; then we delete your details. If you tell us you are not interested, we stop at once (see section 15).",
              ],
              [
                "Must you give it?",
                "You give us nothing; we found it.",
              ],
            ],
          },
          "**You can object to this at any time, without giving a reason, and we will stop contacting you and delete your details** (Article 21(2) and (3) GDPR). A reply saying so to any of our messages, or an email to contact@lineiqgroup.com, is enough.",
        ],
      },
      {
        heading: "Contacts at our partners",
        blocks: [
          "When we work with a business, we handle the details of the people we work with there.",
          {
            facts: [
              [
                "Data",
                "Name, role, business email address and phone number, our correspondence and meeting notes.",
              ],
              [
                "Purpose",
                "To prepare, perform and close the contract with the partner.",
              ],
              [
                "Legal basis",
                "Article 6(1)(b) GDPR if you are the party to the contract (for example a sole trader). Otherwise Article 6(1)(f) GDPR: our legitimate interest in working with the business you represent.",
              ],
              [
                "Kept for",
                "The engagement plus 5 years, the general limitation period under Section 6:22 of the Civil Code.",
              ],
              [
                "Must you give it?",
                "It is needed to work together; without a contact we cannot run the engagement.",
              ],
            ],
          },
          "**The Starting Brief.** At the start of an engagement the partner's owner and approver fill in a form in Tally: their contact details and their answers about the business. Same purpose and legal basis as above. We export the answers to our encrypted storage and delete them from Tally within 30 days; the export is then kept as above.",
        ],
      },
      {
        heading: "Signing agreements",
        blocks: [
          "We sign agreements electronically with Adobe Acrobat Sign.",
          {
            facts: [
              [
                "Data",
                "Signers' names, business email addresses and signatures, and the signing audit report (the times and events of signing). IP addresses are not collected.",
              ],
              [
                "Purpose",
                "To conclude the agreement and be able to prove it.",
              ],
              [
                "Legal basis",
                "Article 6(1)(b) GDPR if you sign as a party; Article 6(1)(f) GDPR, our legitimate interest in a provable signature, if you sign for a company.",
              ],
              [
                "Kept for",
                "The signed copy and its audit report: the engagement plus 5 years. The copy in Acrobat Sign is deleted once filed in our storage.",
              ],
              [
                "Must you give it?",
                "Without a signature the agreement is not concluded.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Invoicing and accounting",
        blocks: [
          {
            facts: [
              [
                "Data",
                "Name, billing address, tax number, invoice details.",
              ],
              [
                "Purpose",
                "To bill, and meet our accounting and tax duties.",
              ],
              [
                "Legal basis",
                "Article 6(1)(c) GDPR: legal obligation, under Act CXXVII of 2007 on VAT (the content of an invoice) and Act C of 2000 on accounting (keeping it).",
              ],
              [
                "Kept for",
                "8 years, as Section 169 of the Accounting Act requires.",
              ],
              [
                "Must you give it?",
                "Yes, the law requires it; without it we cannot issue a lawful invoice.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Social media",
        blocks: [
          "We, and our founders on accounts they use for LineiQ, may contact you or talk with you on Instagram, LinkedIn, YouTube, Facebook, TikTok and Substack. What we note from those conversations is handled as in section 5 or 6. The platform itself handles your data under its own terms, as its own controller; we have no control over that.",
          "On Facebook and Instagram (Meta) and LinkedIn, the platform gives page owners statistics about visitors to the page (Page Insights). For those statistics we and the platform are joint controllers; the platform's addendum sets out who does what, and the platform handles your requests about them: [Meta Page Insights addendum](https://www.facebook.com/legal/terms/page_controller_addendum), [LinkedIn Page Insights addendum](https://legal.linkedin.com/pages-joint-controller-addendum). We see only aggregated statistics, not who you are.",
        ],
      },
      {
        heading: "The language cookie",
        blocks: [
          "The website uses a single cookie. A cookie is a small text file that your browser stores on your device.",
          {
            facts: [
              [
                "Name",
                "lineiq-locale",
              ],
              [
                "Set by",
                "The website itself (first-party), only when you choose a language in the language switcher. If you never choose, you get no cookie.",
              ],
              [
                "Holds",
                "Only the code of the chosen language (en, hu or de). No identifier, no personal data.",
              ],
              [
                "Purpose",
                "Strictly functional: a plain address (such as /about) opens in the chosen language. Nothing is tracked, analysed or shared.",
              ],
              [
                "Lifetime",
                "1 year, renewed each time you choose a language again.",
              ],
              [
                "Attributes",
                "Path=/, SameSite=Lax, Secure over https. Not HttpOnly, because the language switcher writes it in the browser.",
              ],
            ],
          },
          "This cookie is strictly necessary to provide a service you explicitly asked for, so under Section 155(4) of Act C of 2003 on electronic communications and Article 5(3) of Directive 2002/58/EC it needs no consent. You can delete it in your browser's settings; the plain addresses then open in English. The website uses no other cookie, loads no analytics or tracking code, and serves its fonts from its own host.",
        ],
      },
      {
        heading: "Server logs",
        blocks: [
          "When pages of the website are loaded, our host's system records the IP address, the time of the request, the page requested and the browser's identifying details (user agent).",
          {
            facts: [
              [
                "Purpose",
                "The secure and reliable operation of the website; detecting faults and abuse.",
              ],
              [
                "Legal basis",
                "Article 6(1)(f) GDPR: our legitimate interest in running the website securely.",
              ],
              [
                "Kept for",
                "The short time operation requires; the host's system then deletes them automatically. We do not combine them with other data or use them to identify visitors.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Who receives your data",
        blocks: [
          "Apart from LineiQ's two managing directors, only the following receive personal data, and only as far as their task needs.",
          "**Our processors** (they act on our instructions under a data processing agreement):",
          {
            facts: [
              [
                "Proton AG (Switzerland)",
                "Email (contact@lineiqgroup.com), encrypted file storage, password manager. Where the data is: Switzerland. Transfer outside the EU/EEA: Switzerland has an EU adequacy decision.",
              ],
              [
                "Supabase Pte. Ltd. (Singapore)",
                "Our internal workspace (Kontrast): prospect and partner records. Where the data is: EU (Frankfurt). Transfer outside the EU/EEA: Singapore has no EU adequacy decision; the standard contractual clauses in Supabase's data processing agreement.",
              ],
              [
                "Tally BV (Belgium)",
                "The Starting Brief form. Where the data is: EU. Transfer outside the EU/EEA: None.",
              ],
              [
                "Adobe (Acrobat Sign)",
                "Electronic signing. Where the data is: EU (Germany, Ireland). Transfer outside the EU/EEA: Adobe Inc. (USA) is certified under the EU–U.S. Data Privacy Framework; its agreement includes the standard contractual clauses.",
              ],
              [
                "Vercel Inc. (USA)",
                "Hosting the website, server logs. Where the data is: USA. Transfer outside the EU/EEA: EU–U.S. Data Privacy Framework; standard contractual clauses.",
              ],
              [
                "Plus Five Five, Inc., operator of Resend (USA)",
                "Delivering the website form's message by email. Where the data is: USA. Transfer outside the EU/EEA: EU–U.S. Data Privacy Framework; standard contractual clauses.",
              ],
              [
                "GitHub B.V. (Netherlands) and GitHub, Inc. (USA)",
                "The private repository where we keep our working notes on prospects and partners. Where the data is: USA. Transfer outside the EU/EEA: GitHub is certified under the EU–U.S. Data Privacy Framework.",
              ],
              [
                "Anthropic Ireland, Limited (Ireland)",
                "The Claude AI assistant (Team plan, company account): we use it to research, draft and organise, which includes reading our working notes on prospects and partners. Anthropic may not train its models on this data. Where the data is: Not stated by Anthropic for this plan; we treat it as the USA. Transfer outside the EU/EEA: Anthropic is an EU company; any onward transfer is under the standard contractual clauses in its data processing agreement.",
              ],
            ],
          },
          "**Other recipients:**",
          {
            list: [
              "**Social media platforms** (section 9), each under its own terms.",
              "**Our accountant and the tax authority**, for invoicing data, as the law requires.",
            ],
          },
          "The adequacy decision on the EU–U.S. Data Privacy Framework is the European Commission's decision of 10 July 2023 (Article 45 GDPR); the standard contractual clauses are those adopted by the Commission (Article 46 GDPR). We do not sell personal data. We disclose data to an authority only where and as far as the law requires.",
        ],
      },
      {
        heading: "No automated decisions",
        blocks: [
          "No decision about you is made by automated means, and we do not profile you (Article 22 GDPR). An AI assistant may help us research public information, but a person reads it and decides every time.",
        ],
      },
      {
        heading: "Security",
        blocks: [
          "We protect personal data with appropriate technical and organisational measures: unique passwords from a password manager and two-factor authentication, encrypted storage, the least access that does the job, encrypted and updated devices, and confidentiality for everyone with access. The website can only be reached over an encrypted (HTTPS) connection. If a personal data breach occurs, we act under Articles 33 and 34 GDPR: we notify the authority, and if the breach is likely to pose a high risk to you, we inform you too.",
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          {
            list: [
              "**Access** (Article 15): ask whether we handle data about you and get a copy.",
              "**Rectification** (Article 16): have inaccurate data corrected and incomplete data completed.",
              "**Erasure** (Article 17): have your data deleted when it is no longer needed, when you have objected, or when the processing is unlawful.",
              "**Restriction** (Article 18): have your data only stored for a time, for example while its accuracy is checked.",
              "**Portability** (Article 20): receive the data you gave us for a contract or pre-contract steps in a machine-readable format, or have it sent to another controller.",
              "**Objection** (Article 21): object at any time, on grounds relating to your situation, to processing based on our legitimate interest. **If we contact you about our services, you can object at any time without giving a reason, and we stop.**",
            ],
          },
          "Send your request to contact@lineiqgroup.com. We reply without undue delay and within one month at the latest; where justified this can be extended by two further months, and we tell you so within the first month. It is free of charge. If we have doubts about who is asking, we may ask for details to confirm it. We keep your request and our reply for 5 years, to be able to show we handled it (Article 6(1)(f) GDPR: our legitimate interest in this, within the 5-year limitation period of Section 6:22 of the Civil Code).",
        ],
      },
      {
        heading: "Remedies",
        blocks: [
          "If you believe your data is handled unlawfully, please come to us first so we can put it right. You can also complain to the Hungarian National Authority for Data Protection and Freedom of Information (NAIH):",
          {
            facts: [
              [
                "Seat",
                "1055 Budapest, Falk Miksa utca 9–11., Hungary",
              ],
              [
                "Postal address",
                "1363 Budapest, Pf. 9., Hungary",
              ],
              [
                "Phone",
                "+36 1 391 1400",
              ],
              [
                "Email",
                "ugyfelszolgalat@naih.hu",
              ],
              [
                "Website",
                "www.naih.hu",
              ],
            ],
          },
          "You can also go to court (Article 79 GDPR, Section 23 of the Info Act). The regional courts (törvényszék) have competence, and you may bring the case before the court of your place of residence or stay. If you habitually reside in another EU member state, you can also complain to the supervisory authority there.",
        ],
      },
      {
        heading: "Children",
        blocks: [
          "Our services are for businesses. We do not knowingly handle data of anyone under 16.",
        ],
      },
      {
        heading: "Changes to this notice",
        blocks: [
          "We change this notice when the way we work or the law changes. The version in force is always at lineiqgroup.com/privacy, with its version number and the date it took effect. This notice was written in Hungarian; its English and German translations are for information, and wherever they differ, the Hungarian text prevails.",
        ],
      },
    ],
  },
};

export default en;
