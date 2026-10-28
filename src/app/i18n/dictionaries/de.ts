import type { Dictionary } from "./en";

// Typed against the English, so a missing or extra key fails the type check.
// Holds the English until the translation slice (Lineiq-Website#17).
const de: Dictionary = {
  home: {
    hero: {
      // Each word rises on its own; the last word carries the red dot.
      lineOne: "Forget being",
      lastWord: "ordinary",
    },
    intro: {
      lineOneBefore: "A brand-building",
      // "Agency" is struck through by a red redaction, and "Studio" is written
      // over it letter by letter.
      struck: "Agency",
      replacement: "Studio",
      lineOneAfter: "and software house.",
      lineTwoHighlight: "We don't just",
      lineTwoRest: "execute. Even a single website starts with research.",
      lineThree: "We build a name, backed by custom software and a marketing",
      system: "system.",
      ecosystemBefore: "A",
      ecosystem: "world",
      ecosystemAfter: "with a single purpose:",
      closing: "To make you unmistakable.",
    },
    work: {
      cursor: "Case in writing",
      allWork: "All our work",
      allWorkHover: "Let's see",
      projects: {
        klient:
          "Projects, invoicing and client communication on a single surface. The software we built for ourselves before we ever sold it to anyone.",
        north:
          "A budgeting app for iOS that makes money feel calm. A clear visual system, fluid native interactions, and a flow that turns everyday spending into a habit people actually keep.",
        miert:
          "A podcast whose brand is the question. An editorial system, a motion language and a visual voice that sounds the same, recognizably, in every episode.",
      },
    },
    partners: {
      // Word by word; the last word gets the red redaction.
      denial: "We don't take on",
      denialMark: "clients",
      // Followed by the Kranky "partners", which is not keyed.
      claim: "We take on",
      columnOne: [
        "That's the difference: a studio you keep, not a vendor you replace. Built on trust, consistency, and a point of view.",
        "Curious, transparent, ambitious. And a little obsessed with the details most people never notice.",
      ],
      columnTwo: [
        "A project, a maintenance plan, and a real relationship behind both. We pick up the phone, and we show up in person.",
      ],
    },
    manifesto: {
      headingOne: "We didn't lose taste to AI.",
      headingTwo: "We taught it ours.",
      leadOneBefore: "A Hungarian studio,",
      // Held as one unbreakable run, then highlighted together with leadOneEnd.
      leadOneNoBreak: "by Western-European",
      leadOneEnd: "standards.",
      leadTwoBefore: "Everyone uses AI. The difference is the",
      mind: "mind",
      leadTwoMiddle: "and the",
      taste: "taste.",
      leadThree: "Brand, marketing and code from creative minds,",
      leadFourBefore: "with technical and theoretical",
      expertise: "expertise.",
      imageAlt: "LineiQ studio",
    },
    close: {
      headline: "Ready?",
      cta: "Let's begin.",
      ctaHover: "Let's go!",
    },
  },
  about: {
    hero: {
      // Two sets of line breaks, one per measure; CSS shows one. The red mark
      // is the hyphen inside `hyphenated`, wherever that word appears.
      wideLines: [
        "We exist to end",
        "short-termism in the",
        "brands worth building.",
      ],
      narrowLines: [
        "We exist to end",
        "short-termism",
        "in the brands",
        "worth building.",
      ],
      hyphenated: "short-termism",
    },
    origin: {
      paragraphs: [
        "For as long as we have been paying attention, marketing has been eating itself. Every year a new platform. Every quarter a new tactic. Every week another founder learning that the thing they spent six months building has already been replaced by something shinier.",
        "We started LineiQ because we could not find a studio doing the work we wanted to do. Work that compounds. Brands that outlast the people who built them. Systems worth more every year instead of less.",
      ],
    },
    compounds: {
      first: "Most marketing is a tax.",
      secondBefore: "Brand is the only thing that",
      // The word that grows to fill the screen.
      word: "compounds",
      secondAfter: ".",
    },
    beliefs: {
      title: "What we believe, and what believing it costs us.",
      lead: "These are not slogans and they are not negotiable. A principle that costs nothing is just a comfortable belief, so each one below is filed with the bill.",
      // Convictions verbatim from Beliefs (locked v1); costs condensed from the
      // matching House Rule. The rule each one traces to is in AboutBeliefs.
      items: {
        compounding: {
          conviction: "Compounding wins.",
          cost: "We turn down €1,500 to €4,000 a month in one-off campaign work, the kind most studios live on. It stops paying the day it ships.",
        },
        smallWorld: {
          conviction: "We would rather own a small world than rent a big market.",
          cost: "We leave real revenue on the table, in the months we can least afford to.",
        },
        lastWork: {
          conviction:
            "We compete with our last piece of work, not with anyone else.",
          cost: "We rebuild work that is already good enough, spending hours other studios would bank.",
        },
        calm: {
          conviction: "Calm is the product.",
          cost: "We publish less, and slower, than firms that mass-generate. We say no to easy volume.",
        },
        winWin: {
          conviction: "Win-win, or no deal.",
          cost: "We commit to KPIs in writing. If we miss them in the first 30 days, the next month is on us.",
        },
      },
    },
    founders: {
      headingBefore: "Two founders,",
      // The words the red band lands on.
      band: "one voice.",
      // Four rows each, under ~40 characters (sources in data/founders.ts).
      lines: {
        "kondora-kristof": [
          "Two years of client work.",
          "Marketing and SEO partner, Viltor.hu.",
          "Reads the numbers first.",
          "Built Klient. Designed North.",
        ],
        "suto-aron": [
          "Designed our delivery process.",
          "Most of our 22 frameworks.",
          "Market and ICP research.",
          "Positioning, voice and sales.",
        ],
      },
      methodLabel: "The method both of us run on",
      // Canonical names: academy/_Frameworks.md in the vault. The ROI Autopsy
      // and Future Walk lines follow DOP v3, where both run after signing (Acts
      // 1 and 2), not the Academy's pre-sale wording (Lineiq-Website#15).
      frameworks: {
        compoundVsTax: {
          name: "The Compound vs Tax Engine",
          line: "Every euro you spend either builds an asset or pays rent.",
        },
        stopPaying: {
          name: "The Stop-Paying Test",
          line: "If you stopped paying for this tomorrow, would the work survive?",
        },
        roiAutopsy: {
          name: "The ROI Autopsy",
          line: "We find where the current spend is dying before we build anything.",
        },
        velvetRope: {
          name: "The Velvet Rope",
          line: "People are screened out before any deep work begins, not after.",
        },
        futureWalk: {
          name: "The Future Walk",
          line: "Day 1, 30, 90 and 365, walked through before anything is built.",
        },
      },
      // Two clauses, two lines.
      methodShapeOne:
        "Five of {frameworks}, across {layers} layers. The rest are not secrets,",
      methodShapeTwo: "they are just not first impressions.",
    },
    record: {
      label: "The one thing we will not dress up",
      title: "LineiQ has never published a case study.",
      lead: "That is true and we are not going to dress it up. It is also not the same as starting from zero. Kristóf brought the client record below. Áron wrote most of the process we deliver with and most of the twenty-two frameworks it runs on, and owns the research underneath them. Different work, not different weight.",
      rosterLabel: "Clients and projects",
      // One day a year (December 6 to 7) the two ages differ.
      ageSame: "We are both {age}.",
      ageDifferent: "We are {younger} and {older}.",
      close:
        "The studio is younger than the method it runs on: we built the Academy and the Dream Outcome Process before anyone had paid us a euro, because we refuse to charge a price we cannot run a procedure to justify. We will still be students in two years. The one thing we do, we do well.",
    },
    bookshelf: {
      title: "The literature that shapes us.",
      // What each book is to us. The signature under it is the founder's name,
      // in the order data/founders.ts gives for the language.
      books: {
        principles: {
          title: "Principles",
          commentary:
            "LineiQ runs on principles, not assumptions. Who we take on, what we charge, what we refuse: all of it is written down before it is needed, so no decision gets made twice and none of them gets made in a bad week.",
        },
        atomicHabits: {
          title: "Atomic Habits",
          commentary:
            "The reason everything we build comes with a way to keep it running. A goal is a thing you announce; a system is a thing that still runs on the week nobody is watching. We build the second kind, for ourselves and for our partners.",
        },
        zeroToOne: {
          title: "Zero to One",
          commentary:
            "Where our refusal to be another agency comes from. The work is not to win a category, it is to be the only one in it. That is the bar for us and for every brand we build: if a competitor could put their logo on it, it is not finished.",
        },
        hardThing: {
          title: "The Hard Thing About Hard Things",
          commentary:
            "Our licence to have the hard conversation instead of the comfortable one. Building a company offers no good answers, only less bad ones. We name the real problem first, even when it is not the one you hoped we would find.",
        },
        deepWork: {
          title: "Deep Work",
          commentary:
            "Why we work deep, not wide. No Slack flood, no meeting marathon, no drip of questions to your inbox: we ask at the right moments, and only then. Calm is not a perk of the process, it is the process.",
        },
      },
    },
    close: {
      headingOne: "If this resonates,",
      headingTwo: "let's talk.",
      cta: "Let's begin.",
      ctaHover: "Let's go!",
    },
  },
  services: {
    // The frame every category page shares.
    allServices: "All services",
    includes: "What it includes",
    // Every category runs through the Dream Outcome Process (Service Delivery
    // §1), so every category page says so.
    processNote:
      "Every engagement runs through the Dream Outcome Process. Research, your customer and your positioning come first; the work is built on them.",
    // Followed by the next category's name.
    next: "Next",
    // Followed by the remaining categories' names.
    or: "Or:",
    cta: "Let's begin.",
    ctaHover: "Let's talk!",
    // Keyed by category id (the slug) and, inside each, by sub-service id. The
    // order of both, and the Kranky essence word, are in data/services.ts.
    // Content mirrors strategy/service_delivery.md in the Kontrast Vault.
    //
    // Intros carry *highlight* markers around the words the design can set as
    // oversized Fraunces inline (introSegments in data/services.ts).
    categories: {
      "brand-architecture": {
        title: "Brand Architecture",
        intro:
          "The *foundations* of a brand, from strategy to the visual system, in one hand, for companies and for people, so it becomes *recognizable*.",
        subServices: {
          research: {
            title: "Audience, market and competitor research",
            desc: "Who you're talking to, what they want to hear, and who else is talking to them.",
          },
          positioning: {
            title: "Positioning and strategy",
            desc: "Where you stand in the market, and the one-sentence reason to choose you.",
          },
          brandWorld: {
            title: "Brand world and tone of voice",
            desc: "The story, the founder story and the voice the brand speaks with everywhere.",
          },
          naming: {
            title: "Naming",
            desc: "Company, product and campaign names that stick.",
          },
          identity: {
            title: "Logo and identity",
            desc: "The primary mark and the entire system built around it.",
          },
          designSystem: {
            title: "Visual language and design system",
            desc: "Colors, typography, grid and components as one, with a brand guidelines document.",
          },
          rebranding: {
            title: "Rebranding",
            desc: "Repositioning and refreshing an existing brand.",
          },
          maintenance: {
            title: "Maintenance plan",
            desc: "Guidelines kept current, new assets made inside the system.",
          },
        },
      },
      "web-development": {
        title: "Web Development",
        intro:
          "Bespoke, animated sites built on Next.js and on the brand's foundations, lightning fast and *alive* under your hands.",
        subServices: {
          bespokeSite: {
            title: "Bespoke website development",
            desc: "No templates, built for your brand.",
          },
          webDesign: {
            title: "Web design (UI/UX)",
            desc: "An interface people understand on first use.",
          },
          motion: {
            title: "Motion and animation",
            desc: "GSAP, Lenis, motion that sets you apart.",
          },
          copy: {
            title: "Website copy",
            desc: "Written from your positioning and your customers' own words.",
          },
          landingPages: {
            title: "Landing and campaign pages",
            desc: "One goal, one message, nothing in the way.",
          },
          multilingual: {
            title: "Multilingual sites",
            desc: "Every language your customers read.",
          },
          cms: {
            title: "CMS integration",
            desc: "Content you manage yourself, without a developer.",
          },
          performance: {
            title: "Performance and technical SEO",
            desc: "Fast loading, Core Web Vitals, a searchable structure.",
          },
          maintenance: {
            title: "Maintenance plan",
            desc: "The site stays live, updated and secure.",
          },
        },
      },
      ecommerce: {
        title: "Ecommerce",
        intro:
          "Webshops that don't just look good but *sell*, from the product page to the invoice and the *returning* customer.",
        subServices: {
          webshop: {
            title: "Webshop build",
            desc: "Our own webshop system with an admin you log in to, and a storefront made for your brand.",
          },
          shopUx: {
            title: "Shop UX and product page design",
            desc: "The buying journey and product pages that lead to the cart.",
          },
          catalogue: {
            title: "Catalogue upload and product copy",
            desc: "Your whole catalogue in, described in your customers' own words.",
          },
          paymentShipping: {
            title: "Payment and shipping integration",
            desc: "Hungarian and international solutions wired in.",
          },
          invoicing: {
            title: "Invoicing integration",
            desc: "Számlázz.hu, Billingo and international equivalents, hooked up automatically.",
          },
          analytics: {
            title: "Analytics and conversion tracking",
            desc: "Every sale traced back to where it came from.",
          },
          upkeep: {
            title: "Shop upkeep and conversion optimization",
            desc: "After launch, a monthly funnel review and improvements shipped.",
          },
        },
      },
      "software-solutions": {
        title: "Software Solutions",
        intro:
          "Web apps, *iOS and Android* apps, portals and internal tools, from the same *DNA* we built our own platform from.",
        subServices: {
          webApp: {
            title: "Web application development",
            desc: "The SaaS, internal tool, portal or dashboard you need.",
          },
          mobileApp: {
            title: "Mobile app development (iOS and Android)",
            desc: "A thumb-first app, from idea to store launch.",
          },
          productDesign: {
            title: "Product UI/UX design",
            desc: "A product interface that's self-explanatory.",
          },
          mvp: {
            title: "MVP development",
            desc: "A working first version, fast to market.",
          },
          integration: {
            title: "API and integration",
            desc: "Your systems, finally talking to each other.",
          },
          aiFeatures: {
            title: "AI features",
            desc: "Assistants, search and summaries inside the software, where they help.",
          },
          maintenance: {
            title: "Maintenance plan",
            desc: "Fixes, patches and small improvements. New features are their own project.",
          },
        },
      },
      "strategic-marketing": {
        title: "Strategic Marketing",
        intro:
          "Where and why the brand shows up, across paid and organic channels, with *measurable* goals so it *grows*.",
        subServices: {
          channelStrategy: {
            title: "Campaign and channel strategy",
            desc: "A unified plan across channels, with measurable goals.",
          },
          organicSocial: {
            title: "Organic social strategy",
            desc: "The one channel where your customers are, and how to show up there.",
          },
          contentIdeas: {
            title: "Content ideas and scripts",
            desc: "Ideas, scripts and captions in your voice, on a monthly calendar.",
          },
          paidAds: {
            title: "Paid advertising (Meta, Google)",
            desc: "Ads that bring revenue, not just clicks.",
          },
          email: {
            title: "Email marketing",
            desc: "The list that stays yours, and turns into buyers.",
          },
          reporting: {
            title: "Tracking, reporting and strategy",
            desc: "Measured properly, reported monthly, with a strategy session.",
          },
        },
      },
    },
  },
  work: {
    // After the ◆ the page sets in front of it.
    label: "Portfolio",
    // Struck through on the page and answered by the Kranky "not yet.", which
    // is a mark and stays in code.
    titleLines: ["The work we", "put our name on."],
    lede: "The case studies are being written. We would rather show you nothing than something half-finished.",
    cta: "Let's talk?",
    ctaHover: "Let's go!",
    back: "Back to home",
  },
  // The contact flow (contact/ContactFlow). The stages, needs and bands are
  // keyed by the ids in contact/intake.ts, which are the same in every
  // language: only these labels differ, so the route accepts the same answers
  // from every page. "talk soon." on the confirmation is a mark and stays in
  // code; so does the studio's address.
  contact: {
    heading: "Let's talk for real.",
    lede: "Five questions. We read every answer before we reply.",
    begin: "Begin",
    beginHover: "Let's go!",
    aside: "Or just hit us up.",
    // One per counted panel; the statement and the review are not questions.
    questions: {
      who: "Who are you?",
      stage: "Where's the money now?",
      need: "What do you need?",
      budget: "What can you put behind it?",
      note: "Anything we should know?",
    },
    company: "Company",
    email: "Email",
    next: "Next",
    // The note's button while the note is empty.
    skip: "Skip",
    optional: "Optional",
    stages: {
      "not-selling": "Not selling yet",
      inconsistent: "Selling, but inconsistently",
      "selling-well": "Selling well, want more",
    },
    needs: {
      grow: "Grow",
      rebrand: "Rebrand",
      remarket: "Rethink the marketing",
      launch: "Launch something new",
    },
    monthly: "Monthly",
    oneTime: "One-time",
    // The budget switch's accessible name.
    switchLabel: "Show one-time budgets instead of monthly",
    // The figures are per language: forints on /hu, euros elsewhere
    // (Lineiq-Website#13). Four per mode, so the grid does not reflow.
    bands: {
      monthly: {
        "mo-under-2k": "Under €2,000 / mo",
        "mo-2-5k": "€2,000 – 5,000 / mo",
        "mo-5-10k": "€5,000 – 10,000 / mo",
        "mo-10k-up": "€10,000+ / mo",
      },
      "one-time": {
        "ot-under-15k": "Under €15,000",
        "ot-15-30k": "€15,000 – 30,000",
        "ot-30-75k": "€30,000 – 75,000",
        "ot-75k-up": "€75,000+",
      },
    },
    review: {
      heading: "This is what we have.",
      company: "Company",
      email: "Email",
      stage: "Money",
      need: "Need",
      budget: "Budget",
      note: "Note",
      notAnswered: "Not answered",
      change: "Change",
    },
    send: "Send",
    sending: "Sending…",
    sendHover: "Let's go!",
    back: "Back",
    // Beside the send button: the privacy notice, where the data is given.
    privacyLink: "How we handle your answers",
    // Keyed by the codes in contact/intake.ts (INTAKE_ERRORS). company and
    // email are also what the flow says before it lets the visitor past the
    // first question.
    errors: {
      company: "We need the company name, so we know who we are looking at.",
      email: "We need a valid email address, so we have somewhere to reply.",
      steps: "Answer every step and we will have something to work with.",
      budget: "Pick a budget and we will have something to work with.",
      unavailable: "The email service is not configured.",
      failed: "Submission failed, please try again.",
    },
    done: {
      title: "Got it.",
      nextLabel: "Next step",
      next: "We will read your answers against your market, and arrive at the first call already having something to say.",
      responseLabel: "Response time",
      response: "You will hear back by email within 48 hours on business days.",
    },
  },
  nav: {
    links: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
    },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    cta: "Let's talk?",
    ctaHover: "Let's go!",
  },
  // Both footers read this: components/Footer and the overlay on Home's closing
  // sequence (components/SequenceSection). The links, the channel names and the
  // company name are in data/footer.ts.
  footer: {
    studio: "Studio",
    sitemap: "Sitemap",
    connect: "Connect",
    legal: "Legal",
    // The switcher column's heading, and the switcher's accessible name.
    language: "Language",
    links: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
      terms: "Terms",
      privacy: "Privacy",
    },
    copyright: "© {year} LineiQ. All rights reserved.",
  },
  languageSwitcher: {
    label: "Language",
  },
  meta: {
    pages: {
      "/": {
        title: "LineiQ | Brand. Code. Signal.",
        description:
          "A brand and business architecture studio and software house, built in Hungary, working with companies and people anywhere.",
      },
      "/about": {
        title: "About | LineiQ",
        description:
          "A brand and business architecture studio built in Hungary. Our mission, the five beliefs we run on and what they cost us, the two founders behind it, and the books that shape us.",
      },
      "/work": {
        title: "Work | LineiQ",
        description:
          "The LineiQ portfolio. Not yet: the case studies are being written.",
      },
      "/contact": {
        title: "Contact | LineiQ",
        description:
          "Five questions, mostly answered by clicking. We read every answer before we reply.",
      },
      // Already in German, like the legal pages themselves (data/legal).
      "/terms": {
        title: "Nutzungsbedingungen | LineiQ",
        description:
          "Die Bedingungen für die Nutzung von lineiqgroup.com: wer sie betreibt, was die Website ist und was nicht, und die Regeln für ihre Inhalte.",
      },
      "/privacy": {
        title: "Datenschutzerklärung | LineiQ",
        description:
          "Wie LineiQ die über lineiqgroup.com angegebenen Daten verarbeitet: das Kontaktformular, ein Sprach-Cookie, keine Analyse.",
      },
    },
    // A category page's title; its description is the category's intro.
    serviceTitle: "{title} | LineiQ",
  },
};

export default de;
