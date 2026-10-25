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
  ["Represented by", "Kristóf Kondora and Áron Sütő, managing directors"],
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
          "The controller of the personal data given through the website www.lineiqgroup.com (the website) is (LineiQ, we or us):",
          { facts: company },
          "We are not required to appoint a data protection officer and have not appointed one. Questions about how we handle data can be sent to the email address above.",
        ],
      },
      {
        heading: "What this notice covers",
        blocks: [
          "Under Article 13 of Regulation (EU) 2016/679 of the European Parliament and of the Council (the General Data Protection Regulation, GDPR) and Act CXII of 2011 on informational self-determination and freedom of information (the Info Act), this notice explains which personal data we handle when you use the website, for what purpose, on what legal basis and for how long, who can access it, and what rights you have.",
          "This notice covers every language version of the website. Our partners' data is handled during an engagement under the contract and the separate notice that comes with it.",
        ],
      },
      {
        heading: "In short",
        blocks: [
          {
            list: [
              "We handle only the details you give us in the contact form or by email, and our host's server logs.",
              "We use no analytics, no tracking code, and no advertising or social media cookies.",
              "We set one cookie, and only when you choose a language: it remembers the language you chose.",
              "We do not sell your data, and we do not pass it to anyone for marketing.",
            ],
          },
        ],
      },
      {
        heading: "The contact form",
        blocks: [
          "The form on the Contact page lets you get in touch with us to ask for an offer or to work with us.",
          {
            facts: [
              [
                "Data handled",
                "the company name, the email address, your answers to the form's questions (where the business stands now, the service needed, the budget range), the optional note, and the language of the page on which you filled in the form. The company name and the email address are personal data when they identify a natural person, for example a sole trader's name or an email address in a person's name.",
              ],
              [
                "Purpose",
                "to answer your enquiry, to judge whether our services fit what you need, and to talk before a contract.",
              ],
              [
                "Legal basis",
                "Article 6(1)(b) GDPR: steps taken at your request before entering into a contract. If you contact us as the representative or an employee of a company, the legal basis is Article 6(1)(f) GDPR: our legitimate interest in answering business enquiries.",
              ],
              [
                "Retention",
                "if the enquiry does not lead to a contract, 12 months from the last exchange of messages, after which we delete it. If a contract follows, we keep the correspondence for 5 years from the end of the contract, the general limitation period under the Civil Code.",
              ],
              [
                "Giving the data",
                "is voluntary. Without the company name and the email address we cannot reply, so the form cannot be sent without them.",
              ],
            ],
          },
          "The website does not store the form's data in a database: when you send it, it arrives in our mailbox as an email, and we handle it there. If you write to us by email instead of using the form, we handle the details in it for the same purpose, on the same basis and for the same period.",
          "Every enquiry is read and answered by a person. Your answers in the form are not used for automated decision-making or profiling.",
          "To filter out unsolicited, automated submissions, the form checks a hidden field and how long it took to fill in. We derive no personal data from these and store none.",
        ],
      },
      {
        heading: "The language cookie",
        blocks: [
          "The website uses a single cookie. A cookie is a small text file that your browser stores on your device.",
          {
            facts: [
              ["Name", "lineiq-locale"],
              [
                "Set by",
                "the website itself (a first-party cookie), and only when you choose a language in the language switcher. If you never choose, you get no cookie.",
              ],
              [
                "Holds",
                "only the code of the chosen language (en, hu or de). It contains no identifier and no personal data.",
              ],
              [
                "Purpose",
                "strictly functional: a plain address (such as /about) opens in the chosen language. Nothing is tracked, analysed or shared.",
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
          "This cookie is strictly necessary to provide a service you explicitly asked for, so under Section 155(4) of Act C of 2003 on electronic communications and Article 5(3) of Directive 2002/58/EC it needs no consent. You can delete it at any time in your browser's settings; the website's plain addresses then open in English.",
          "The website uses no other cookie, loads no analytics or tracking code, and serves its fonts from its own host, so no data reaches a third party because of the fonts either.",
        ],
      },
      {
        heading: "Server logs",
        blocks: [
          "The website is run by our host (see the next section). When pages are loaded, the host's system records technical data: the IP address, the time of the request, the address of the page requested, and the browser's identifying details (user agent).",
          {
            facts: [
              [
                "Purpose",
                "the secure and reliable operation of the website, and detecting faults and abuse.",
              ],
              [
                "Legal basis",
                "Article 6(1)(f) GDPR: our legitimate interest in running the website securely.",
              ],
              [
                "Retention",
                "the host's system keeps them for the short time operation requires, then deletes them automatically. We do not combine this data with other data, and we do not use it to identify visitors.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Processors and transfers",
        blocks: [
          "Apart from us, only the providers that help run the website as processors can access the data, and only as far as that requires:",
          {
            list: [
              "Vercel Inc. (440 N Barranca Avenue #4133, Covina, CA 91723, United States; privacy@vercel.com): hosting and server logs.",
              "Plus Five Five, Inc., the operator of Resend (2261 Market Street #5039, San Francisco, CA 94114, United States; support@resend.com): delivering the form's message by email.",
              "Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Ireland): the email service (Google Workspace) in which we receive and answer enquiries.",
            ],
          },
          "Vercel and Resend handle data in the United States, and Google may handle some data outside the European Union. These transfers rest on the European Commission's adequacy decision of 10 July 2023 on the EU–U.S. Data Privacy Framework (Article 45 GDPR), which the providers have joined, and on the standard data protection clauses adopted by the Commission (Article 46 GDPR).",
          "We do not sell personal data and do not pass it to anyone for marketing. We disclose data to an authority only where and as far as the law requires.",
        ],
      },
      {
        heading: "Security",
        blocks: [
          "The website can only be reached over an encrypted (HTTPS) connection. Only LineiQ's managing directors can access enquiries. We protect the data with appropriate technical and organisational measures against unauthorised access, alteration, transfer, disclosure, deletion and destruction.",
          "If a personal data breach occurs, we act under Articles 33 and 34 GDPR: we notify the authority, and if the breach is likely to pose a high risk to you, we inform you too.",
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          "Under the GDPR you have the following rights regarding the processing:",
          {
            list: [
              "Access (Article 15): you can ask whether we handle data about you and, if we do, ask for a copy.",
              "Rectification (Article 16): you can ask us to correct inaccurate data and complete incomplete data.",
              "Erasure (Article 17): you can ask us to delete your data if it is no longer needed or if the processing is unlawful.",
              "Restriction (Article 18): you can ask us only to store your data for a time, for example while we check that it is accurate.",
              "Portability (Article 20): you can receive the data we handle on the basis of pre-contract steps in a structured, machine-readable format, or ask us to send it to another controller.",
              "Objection (Article 21): you can object at any time, on grounds relating to your particular situation, to processing based on our legitimate interest.",
            ],
          },
          "Send your request to hello@lineiqgroup.com. We reply without undue delay and within one month at the latest; where justified this can be extended by a further two months, and we tell you so within the first month. Information and action are free of charge. If we have doubts about the requester's identity, we may ask for further details to confirm it.",
        ],
      },
      {
        heading: "Remedies",
        blocks: [
          "If you believe your data is being handled unlawfully, please come to us first so that we can put it right directly. You can also complain to the Hungarian National Authority for Data Protection and Freedom of Information (NAIH):",
          {
            facts: [
              ["Seat", "1055 Budapest, Falk Miksa utca 9–11., Hungary"],
              ["Postal address", "1363 Budapest, Pf. 9., Hungary"],
              ["Phone", "+36 1 391 1400"],
              ["Email", "ugyfelszolgalat@naih.hu"],
              ["Website", "www.naih.hu"],
            ],
          },
          "If your rights are infringed, you can also go to court (Article 79 GDPR, Section 23 of the Info Act). The case falls within the competence of the regional courts (törvényszék), and you may choose to bring it before the court of your place of residence or stay. If you habitually reside in another member state of the European Union, you can also complain to the data protection supervisory authority there.",
        ],
      },
      {
        heading: "Children",
        blocks: [
          "The website is meant for businesses. We do not knowingly collect data from anyone under 16.",
        ],
      },
      {
        heading: "Changes to this notice",
        blocks: [
          "We change this notice when the way the website works or the law changes. The version in force is always on this page, with its version number and the date it took effect at the top.",
          "This notice was written in Hungarian. Its English and German translations are for information; wherever they differ, the Hungarian text prevails.",
        ],
      },
    ],
  },
};

export default en;
