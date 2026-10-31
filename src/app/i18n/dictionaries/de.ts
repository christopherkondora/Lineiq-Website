import type { Dictionary } from "./en";

// Typed against the English, so a missing or extra key fails the type check.
//
// Claude's translation of the frozen English (Lineiq-Website#17); Kristóf and
// Áron edit it. The conventions it follows:
//   - "Sie", like the legal pages; the studio's own "wir" wherever the English
//     invites ("Let's talk" is "Reden wir"), so the formal address is rare.
//   - The Kranky marks and the proper nouns stay as the English dictionary
//     leaves them. So do the Glossary's named concepts: the five category names
//     and the Dream Outcome Process, the framework names, the book titles.
//   - Ordinary words are translated, "maintenance plan" as "Wartungspaket".
//   - Euro amounts are written the German way: 1.500 €, a space before the sign.
const de: Dictionary = {
  home: {
    hero: {
      // Each word rises on its own; the last word carries the red dot.
      lineOne: "Vergessen Sie",
      lastWord: "Mittelmaß",
    },
    intro: {
      lineOneBefore: "Ein",
      // "Agentur" is struck through by a red redaction, and "Studio" is
      // written over it letter by letter.
      struck: "Agentur",
      replacement: "Studio",
      lineOneAfter: "für Markenaufbau und ein Softwarehaus.",
      lineTwoHighlight: "Wir führen nicht nur",
      lineTwoRest: "aus. Schon eine einzelne Website beginnt mit Recherche.",
      lineThree:
        "Wir bauen einen Namen, getragen von Software nach Maß und einem",
      system: "Marketingsystem.",
      ecosystemBefore: "Eine",
      ecosystem: "Welt",
      ecosystemAfter: "mit einem einzigen Zweck:",
      closing: "Sie unverwechselbar zu machen.",
    },
    work: {
      cursor: "Fallstudie in Arbeit",
      allWork: "Alle unsere Arbeiten",
      allWorkHover: "Schauen wir",
      projects: {
        klient:
          "Projekte, Rechnungsstellung und Kundenkommunikation auf einer einzigen Oberfläche. Die Software, die wir für uns selbst gebaut haben, bevor wir sie je an irgendjemanden verkauft haben.",
        north:
          "Eine Budget-App für iOS, bei der sich Geld ruhig anfühlt. Ein klares visuelles System, flüssige native Interaktionen und ein Ablauf, der aus alltäglichen Ausgaben eine Gewohnheit macht, die Menschen wirklich behalten.",
        miert:
          "Ein Podcast, dessen Marke die Frage ist. Ein redaktionelles System, eine Bewegungssprache und eine visuelle Stimme, die in jeder Folge gleich klingt und wiedererkennbar bleibt.",
      },
    },
    partners: {
      // Word by word; the last word gets the red redaction.
      denial: "Wir arbeiten nicht für",
      denialMark: "Kunden",
      // Followed by the Kranky "partners", which is not keyed.
      claim: "Wir arbeiten mit",
      columnOne: [
        "Das ist der Unterschied: ein Studio, das Sie behalten, kein Dienstleister, den Sie ersetzen. Gebaut auf Vertrauen, Beständigkeit und einer Haltung.",
        "Neugierig, transparent, ehrgeizig. Und ein wenig besessen von den Details, die die meisten nie bemerken.",
      ],
      columnTwo: [
        "Ein Projekt, ein Wartungspaket und eine echte Beziehung hinter beidem. Wir gehen ans Telefon, und wir kommen persönlich vorbei.",
      ],
    },
    manifesto: {
      headingOne: "Wir haben den Geschmack nicht an die KI verloren.",
      headingTwo: "Wir haben ihr unseren beigebracht.",
      leadOneBefore: "Ein ungarisches Studio,",
      // Held as one unbreakable run, then highlighted together with leadOneEnd.
      leadOneNoBreak: "nach westeuropäischen",
      leadOneEnd: "Maßstäben.",
      leadTwoBefore: "Alle nutzen KI. Der Unterschied ist der",
      mind: "Verstand",
      leadTwoMiddle: "und der",
      taste: "Geschmack.",
      leadThree: "Marke, Marketing und Code von kreativen Köpfen,",
      leadFourBefore: "mit technischer und theoretischer",
      expertise: "Expertise.",
      imageAlt: "LineiQ-Studio",
    },
    close: {
      headline: "Bereit?",
      cta: "Fangen wir an.",
      ctaHover: "Los geht's!",
    },
  },
  about: {
    hero: {
      // Two sets of line breaks, one per measure; CSS shows one. The red mark
      // is the hyphen inside `hyphenated`, wherever that word appears.
      wideLines: [
        "Wir beenden das",
        "Kurzfrist-Denken bei",
        "Marken, die sich lohnen.",
      ],
      narrowLines: [
        "Wir beenden das",
        "Kurzfrist-Denken",
        "bei Marken,",
        "die sich lohnen.",
      ],
      hyphenated: "Kurzfrist-Denken",
    },
    origin: {
      paragraphs: [
        "Solange wir hinschauen, frisst sich das Marketing selbst auf. Jedes Jahr eine neue Plattform. Jedes Quartal eine neue Taktik. Jede Woche lernt ein weiterer Gründer, dass das, woran er sechs Monate gebaut hat, längst durch etwas Glänzenderes ersetzt wurde.",
        "Wir haben LineiQ gegründet, weil wir kein Studio fanden, das die Arbeit macht, die wir machen wollten. Arbeit, die sich aufbaut. Marken, die ihre Erbauer überdauern. Systeme, die jedes Jahr mehr wert sind statt weniger.",
      ],
    },
    compounds: {
      first: "Das meiste Marketing ist eine Steuer.",
      secondBefore: "Marke ist das Einzige, was sich",
      // The word that grows to fill the screen.
      word: "verzinst",
      secondAfter: ".",
    },
    beliefs: {
      title: "Woran wir glauben, und was uns das Glauben kostet.",
      lead: "Das sind keine Slogans, und sie sind nicht verhandelbar. Ein Prinzip, das nichts kostet, ist nur eine bequeme Überzeugung, deshalb ist jedes der folgenden mit der Rechnung abgelegt.",
      // Convictions verbatim from Beliefs (locked v1); costs condensed from the
      // matching House Rule. The rule each one traces to is in AboutBeliefs.
      items: {
        compounding: {
          conviction: "Der Zinseszins gewinnt.",
          cost: "Wir lehnen 1.500 bis 4.000 € im Monat an einmaligen Kampagnenaufträgen ab, wovon die meisten Studios leben. Sie zahlen nicht mehr, sobald sie ausgeliefert sind.",
        },
        smallWorld: {
          conviction:
            "Wir besitzen lieber eine kleine Welt, als einen großen Markt zu mieten.",
          cost: "Wir lassen echten Umsatz liegen, und zwar in den Monaten, in denen wir ihn am wenigsten entbehren können.",
        },
        lastWork: {
          conviction:
            "Wir messen uns an unserer letzten Arbeit, nicht an irgendjemand anderem.",
          cost: "Wir bauen Arbeit neu, die schon gut genug ist, und verbrauchen Stunden, die andere Studios einstreichen würden.",
        },
        calm: {
          conviction: "Ruhe ist das Produkt.",
          cost: "Wir veröffentlichen weniger und langsamer als Firmen, die am Fließband generieren. Wir sagen Nein zu leichtem Volumen.",
        },
        winWin: {
          conviction: "Win-win, oder kein Deal.",
          cost: "Wir verpflichten uns schriftlich auf KPIs. Verfehlen wir sie in den ersten 30 Tagen, geht der nächste Monat auf uns.",
        },
      },
    },
    founders: {
      headingBefore: "Zwei Gründer,",
      // The words the red band lands on.
      band: "eine Stimme.",
      // Four rows each, under ~40 characters (sources in data/founders.ts).
      lines: {
        "kondora-kristof": [
          "Zwei Jahre Arbeit mit Kunden.",
          "Marketing- und SEO-Partner, Viltor.hu.",
          "Liest zuerst die Zahlen.",
          "Baute Klient. Gestaltete North.",
        ],
        "suto-aron": [
          "Entwarf unseren Arbeitsprozess.",
          "Die meisten unserer 22 Frameworks.",
          "Markt- und ICP-Recherche.",
          "Positionierung, Tonalität, Vertrieb.",
        ],
      },
      methodLabel: "Die Methode, nach der wir beide arbeiten",
      // Canonical names: academy/_Frameworks.md in the vault; the names stay
      // English, the lines are translated. The ROI Autopsy and Future Walk lines
      // follow DOP v3, where both run after signing (Acts 1 and 2), not the
      // Academy's pre-sale wording (Lineiq-Website#15).
      frameworks: {
        compoundVsTax: {
          name: "The Compound vs Tax Engine",
          line: "Jeder Euro, den Sie ausgeben, baut entweder einen Wert auf oder zahlt Miete.",
        },
        stopPaying: {
          name: "The Stop-Paying Test",
          line: "Würde die Arbeit überleben, wenn Sie morgen aufhören, dafür zu zahlen?",
        },
        roiAutopsy: {
          name: "The ROI Autopsy",
          line: "Wir finden heraus, wo das aktuelle Budget versickert, bevor wir irgendetwas bauen.",
        },
        velvetRope: {
          name: "The Velvet Rope",
          line: "Wer nicht passt, scheidet aus, bevor die eigentliche Arbeit beginnt, nicht danach.",
        },
        futureWalk: {
          name: "The Future Walk",
          line: "Tag 1, 30, 90 und 365, durchgegangen, bevor irgendetwas gebaut wird.",
        },
      },
      // Two clauses, two lines.
      methodShapeOne:
        "Fünf von {frameworks}, verteilt auf {layers} Ebenen. Der Rest ist kein Geheimnis,",
      methodShapeTwo: "er macht nur keinen ersten Eindruck.",
    },
    record: {
      label: "Das Eine, was wir nicht schönreden",
      title: "LineiQ hat noch nie eine Fallstudie veröffentlicht.",
      lead: "Das stimmt, und wir werden es nicht schönreden. Es ist aber auch nicht dasselbe, wie bei null anzufangen. Kristóf hat die Kundenreferenzen unten mitgebracht. Áron hat den größten Teil des Prozesses geschrieben, mit dem wir arbeiten, und die meisten der zweiundzwanzig Frameworks, auf denen er läuft, und er verantwortet die Recherche darunter. Andere Arbeit, nicht anderes Gewicht.",
      rosterLabel: "Kunden und Projekte",
      // One day a year (December 6 to 7) the two ages differ.
      ageSame: "Wir sind beide {age}.",
      ageDifferent: "Wir sind {younger} und {older}.",
      close:
        "Das Studio ist jünger als die Methode, nach der es arbeitet: Wir haben die Academy und den Dream Outcome Process gebaut, bevor uns jemand einen Euro gezahlt hat, weil wir keinen Preis verlangen, den wir nicht mit einem Verfahren begründen können. In zwei Jahren werden wir immer noch Lernende sein. Das Eine, was wir tun, tun wir gut.",
    },
    bookshelf: {
      title: "Die Literatur, die uns prägt.",
      // What each book is to us. The signature under it is the founder's name,
      // in the order data/founders.ts gives for the language.
      books: {
        principles: {
          title: "Principles",
          commentary:
            "LineiQ läuft auf Prinzipien, nicht auf Annahmen. Wen wir annehmen, was wir verlangen, was wir ablehnen: Alles ist aufgeschrieben, bevor es gebraucht wird, damit keine Entscheidung zweimal fällt und keine in einer schlechten Woche.",
        },
        atomicHabits: {
          title: "Atomic Habits",
          commentary:
            "Der Grund, warum alles, was wir bauen, eine Möglichkeit mitbringt, es am Laufen zu halten. Ein Ziel ist etwas, das man verkündet; ein System läuft auch in der Woche weiter, in der niemand hinsieht. Wir bauen die zweite Art, für uns und für unsere Partner.",
        },
        zeroToOne: {
          title: "Zero to One",
          commentary:
            "Woher unsere Weigerung kommt, noch eine Agentur zu sein. Die Aufgabe ist nicht, eine Kategorie zu gewinnen, sondern die Einzige darin zu sein. Das ist unser Maßstab und der für jede Marke, die wir bauen: Wenn ein Wettbewerber sein Logo daraufsetzen könnte, ist sie nicht fertig.",
        },
        hardThing: {
          title: "The Hard Thing About Hard Things",
          commentary:
            "Unsere Lizenz, das schwierige Gespräch zu führen statt des bequemen. Ein Unternehmen aufzubauen bietet keine guten Antworten, nur weniger schlechte. Wir benennen zuerst das wahre Problem, auch wenn es nicht das ist, das Sie sich erhofft hatten.",
        },
        deepWork: {
          title: "Deep Work",
          commentary:
            "Warum wir in die Tiefe arbeiten, nicht in die Breite. Keine Slack-Flut, kein Meeting-Marathon, kein Tröpfeln von Fragen in Ihr Postfach: Wir fragen zu den richtigen Zeitpunkten, und nur dann. Ruhe ist kein Extra des Prozesses, sie ist der Prozess.",
        },
      },
    },
    close: {
      headingOne: "Wenn Sie sich darin wiederfinden,",
      headingTwo: "reden wir.",
      cta: "Fangen wir an.",
      ctaHover: "Los geht's!",
    },
  },
  services: {
    // The frame every category page shares.
    allServices: "Alle Leistungen",
    includes: "Was enthalten ist",
    // Every category runs through the Dream Outcome Process (Service Delivery
    // §1), so every category page says so.
    processNote:
      "Jedes Engagement läuft über den Dream Outcome Process. Recherche, Ihre Kunden und Ihre Positionierung kommen zuerst; die Arbeit baut darauf auf.",
    // Followed by the next category's name.
    next: "Weiter",
    // Followed by the remaining categories' names.
    or: "Oder:",
    cta: "Fangen wir an.",
    ctaHover: "Reden wir!",
    // Keyed by category id (the slug) and, inside each, by sub-service id. The
    // order of both, and the Kranky essence word, are in data/services.ts. The
    // category titles are the Glossary's names and stay English.
    //
    // Intros carry *highlight* markers around the words the design can set as
    // oversized Fraunces inline (introSegments in data/services.ts).
    categories: {
      "brand-architecture": {
        title: "Brand Architecture",
        intro:
          "Das *Fundament* einer Marke, von der Strategie bis zum visuellen System, aus einer Hand, für Unternehmen und für Menschen, damit sie *wiedererkennbar* wird.",
        subServices: {
          research: {
            title: "Zielgruppen-, Markt- und Wettbewerbsrecherche",
            desc: "Mit wem Sie sprechen, was diese Menschen hören wollen und wer sonst noch mit ihnen spricht.",
          },
          positioning: {
            title: "Positionierung und Strategie",
            desc: "Wo Sie im Markt stehen, und der eine Satz, der erklärt, warum man Sie wählt.",
          },
          brandWorld: {
            title: "Markenwelt und Tonalität",
            desc: "Die Geschichte, die Gründergeschichte und die Stimme, mit der die Marke überall spricht.",
          },
          naming: {
            title: "Naming",
            desc: "Namen für Unternehmen, Produkte und Kampagnen, die hängen bleiben.",
          },
          identity: {
            title: "Logo und Identität",
            desc: "Das Hauptzeichen und das gesamte System darum herum.",
          },
          designSystem: {
            title: "Visuelle Sprache und Designsystem",
            desc: "Farben, Typografie, Raster und Komponenten als Ganzes, mit einem Markenhandbuch.",
          },
          rebranding: {
            title: "Rebranding",
            desc: "Eine bestehende Marke neu positionieren und auffrischen.",
          },
          maintenance: {
            title: "Wartungspaket",
            desc: "Richtlinien, die aktuell bleiben, und neue Assets, die innerhalb des Systems entstehen.",
          },
        },
      },
      "web-development": {
        title: "Web Development",
        intro:
          "Maßgeschneiderte, animierte Websites auf Basis von Next.js und der Grundlagen der Marke, blitzschnell und *lebendig* unter Ihren Händen.",
        subServices: {
          bespokeSite: {
            title: "Individuelle Website-Entwicklung",
            desc: "Keine Vorlagen, gebaut für Ihre Marke.",
          },
          webDesign: {
            title: "Webdesign (UI/UX)",
            desc: "Eine Oberfläche, die man beim ersten Gebrauch versteht.",
          },
          motion: {
            title: "Motion und Animation",
            desc: "GSAP, Lenis, Bewegung, die Sie abhebt.",
          },
          copy: {
            title: "Website-Texte",
            desc: "Geschrieben aus Ihrer Positionierung und den eigenen Worten Ihrer Kunden.",
          },
          landingPages: {
            title: "Landing- und Kampagnenseiten",
            desc: "Ein Ziel, eine Botschaft, nichts im Weg.",
          },
          multilingual: {
            title: "Mehrsprachige Websites",
            desc: "Jede Sprache, die Ihre Kunden lesen.",
          },
          cms: {
            title: "CMS-Integration",
            desc: "Inhalte, die Sie selbst pflegen, ohne Entwickler.",
          },
          performance: {
            title: "Performance und technisches SEO",
            desc: "Schnelles Laden, Core Web Vitals, eine auffindbare Struktur.",
          },
          maintenance: {
            title: "Wartungspaket",
            desc: "Die Website bleibt online, aktuell und sicher.",
          },
        },
      },
      ecommerce: {
        title: "Ecommerce",
        intro:
          "Webshops, die nicht nur gut aussehen, sondern *verkaufen*, von der Produktseite bis zur Rechnung und zum *wiederkehrenden* Kunden.",
        subServices: {
          webshop: {
            title: "Webshop-Aufbau",
            desc: "Unser eigenes Webshop-System mit einem Admin-Bereich, in dem Sie sich anmelden, und einem Storefront, gemacht für Ihre Marke.",
          },
          shopUx: {
            title: "Shop-UX und Produktseiten-Design",
            desc: "Der Kaufweg und Produktseiten, die in den Warenkorb führen.",
          },
          catalogue: {
            title: "Katalogimport und Produkttexte",
            desc: "Ihr gesamter Katalog, beschrieben in den eigenen Worten Ihrer Kunden.",
          },
          paymentShipping: {
            title: "Zahlungs- und Versandanbindung",
            desc: "Ungarische und internationale Lösungen, eingebunden.",
          },
          invoicing: {
            title: "Rechnungsanbindung",
            desc: "Számlázz.hu, Billingo und internationale Entsprechungen, automatisch angebunden.",
          },
          analytics: {
            title: "Analytics und Conversion-Tracking",
            desc: "Jeder Verkauf, zurückverfolgt bis zu seiner Herkunft.",
          },
          upkeep: {
            title: "Shop-Pflege und Conversion-Optimierung",
            desc: "Nach dem Launch: eine monatliche Funnel-Auswertung und ausgelieferte Verbesserungen.",
          },
        },
      },
      "software-solutions": {
        title: "Software Solutions",
        intro:
          "Web-Apps, *iOS- und Android-Apps*, Portale und interne Tools, aus derselben *DNA*, aus der wir unsere eigene Plattform gebaut haben.",
        subServices: {
          webApp: {
            title: "Entwicklung von Webanwendungen",
            desc: "Das SaaS, das interne Tool, das Portal oder das Dashboard, das Sie brauchen.",
          },
          mobileApp: {
            title: "Entwicklung mobiler Apps (iOS und Android)",
            desc: "Eine App für den Daumen, von der Idee bis zum Store-Launch.",
          },
          productDesign: {
            title: "Produkt-UI/UX-Design",
            desc: "Eine Produktoberfläche, die sich selbst erklärt.",
          },
          mvp: {
            title: "MVP-Entwicklung",
            desc: "Eine funktionierende erste Version, schnell am Markt.",
          },
          integration: {
            title: "API und Integration",
            desc: "Ihre Systeme, endlich im Gespräch miteinander.",
          },
          aiFeatures: {
            title: "KI-Funktionen",
            desc: "Assistenten, Suche und Zusammenfassungen in der Software, wo sie helfen.",
          },
          maintenance: {
            title: "Wartungspaket",
            desc: "Fehlerbehebungen, Patches und kleine Verbesserungen. Neue Funktionen sind ein eigenes Projekt.",
          },
        },
      },
      "strategic-marketing": {
        title: "Strategic Marketing",
        intro:
          "Wo und warum die Marke auftaucht, über bezahlte und organische Kanäle, mit *messbaren* Zielen, damit sie *wächst*.",
        subServices: {
          channelStrategy: {
            title: "Kampagnen- und Kanalstrategie",
            desc: "Ein einheitlicher Plan über alle Kanäle, mit messbaren Zielen.",
          },
          organicSocial: {
            title: "Organische Social-Media-Strategie",
            desc: "Der eine Kanal, auf dem Ihre Kunden sind, und wie Sie dort auftreten.",
          },
          contentIdeas: {
            title: "Content-Ideen und Skripte",
            desc: "Ideen, Skripte und Bildunterschriften in Ihrer Stimme, auf einem Monatskalender.",
          },
          paidAds: {
            title: "Bezahlte Werbung (Meta, Google)",
            desc: "Anzeigen, die Umsatz bringen, nicht nur Klicks.",
          },
          email: {
            title: "E-Mail-Marketing",
            desc: "Die Liste, die Ihnen gehört und aus der Käufer werden.",
          },
          reporting: {
            title: "Tracking, Reporting und Strategie",
            desc: "Sauber gemessen, monatlich berichtet, mit einem Strategiegespräch.",
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
    titleLines: ["Die Arbeit, für die", "wir mit unserem Namen stehen."],
    lede: "Die Fallstudien werden gerade geschrieben. Wir zeigen Ihnen lieber nichts als etwas Halbfertiges.",
    cta: "Reden wir?",
    ctaHover: "Los geht's!",
    back: "Zurück zur Startseite",
  },
  // The contact flow (contact/ContactFlow). The stages, needs and bands are
  // keyed by the ids in contact/intake.ts, which are the same in every
  // language: only these labels differ, so the route accepts the same answers
  // from every page. "talk soon." on the confirmation is a mark and stays in
  // code; so does the studio's address.
  contact: {
    heading: "Reden wir richtig.",
    lede: "Fünf Fragen. Wir lesen jede Antwort, bevor wir antworten.",
    begin: "Beginnen",
    beginHover: "Los geht's!",
    aside: "Oder melden Sie sich einfach.",
    // One per counted panel; the statement and the review are not questions.
    questions: {
      who: "Wer sind Sie?",
      stage: "Wo stehen Sie beim Umsatz?",
      need: "Was brauchen Sie?",
      budget: "Was können Sie dafür einsetzen?",
      note: "Gibt es etwas, das wir wissen sollten?",
    },
    company: "Unternehmen",
    email: "E-Mail",
    next: "Weiter",
    // The note's button while the note is empty.
    skip: "Überspringen",
    optional: "Optional",
    stages: {
      "not-selling": "Noch kein Umsatz",
      inconsistent: "Umsatz, aber unregelmäßig",
      "selling-well": "Umsatz läuft gut, wir wollen mehr",
    },
    needs: {
      grow: "Wachsen",
      rebrand: "Rebranding",
      remarket: "Marketing neu denken",
      launch: "Etwas Neues starten",
    },
    monthly: "Monatlich",
    oneTime: "Einmalig",
    // The budget switch's accessible name.
    switchLabel: "Einmalige statt monatliche Budgets anzeigen",
    // The figures are per language: forints on /hu, euros elsewhere
    // (Lineiq-Website#13). Four per mode, so the grid does not reflow.
    bands: {
      monthly: {
        "mo-under-2k": "Unter 2.000 € / Monat",
        "mo-2-5k": "2.000 – 5.000 € / Monat",
        "mo-5-10k": "5.000 – 10.000 € / Monat",
        "mo-10k-up": "Ab 10.000 € / Monat",
      },
      "one-time": {
        "ot-under-15k": "Unter 15.000 €",
        "ot-15-30k": "15.000 – 30.000 €",
        "ot-30-75k": "30.000 – 75.000 €",
        "ot-75k-up": "Ab 75.000 €",
      },
    },
    review: {
      heading: "Das haben wir.",
      company: "Unternehmen",
      email: "E-Mail",
      stage: "Umsatz",
      need: "Bedarf",
      budget: "Budget",
      note: "Anmerkung",
      notAnswered: "Nicht beantwortet",
      change: "Ändern",
    },
    send: "Senden",
    sending: "Wird gesendet…",
    sendHover: "Los geht's!",
    back: "Zurück",
    // Beside the send button: the privacy notice, where the data is given.
    privacyLink: "Wie wir mit Ihren Antworten umgehen",
    // Keyed by the codes in contact/intake.ts (INTAKE_ERRORS). company and
    // email are also what the flow says before it lets the visitor past the
    // first question.
    errors: {
      company:
        "Wir brauchen den Firmennamen, damit wir wissen, wen wir vor uns haben.",
      email:
        "Wir brauchen eine gültige E-Mail-Adresse, damit wir wissen, wohin wir antworten.",
      steps:
        "Beantworten Sie jeden Schritt, dann haben wir etwas, womit wir arbeiten können.",
      budget:
        "Wählen Sie ein Budget, dann haben wir etwas, womit wir arbeiten können.",
      unavailable: "Der E-Mail-Dienst ist nicht konfiguriert.",
      failed: "Das Senden ist fehlgeschlagen, bitte versuchen Sie es erneut.",
    },
    done: {
      title: "Angekommen.",
      nextLabel: "Nächster Schritt",
      next: "Wir lesen Ihre Antworten vor dem Hintergrund Ihres Marktes und kommen zum ersten Gespräch bereits mit etwas, das wir sagen können.",
      responseLabel: "Antwortzeit",
      response:
        "Sie hören innerhalb von 48 Stunden an Werktagen per E-Mail von uns.",
    },
  },
  nav: {
    links: {
      home: "Startseite",
      services: "Leistungen",
      about: "Über uns",
      contact: "Kontakt",
    },
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    cta: "Reden wir?",
    ctaHover: "Los geht's!",
  },
  // Both footers read this: components/Footer and the overlay on Home's closing
  // sequence (components/SequenceSection). The links, the channel names and the
  // company name are in data/footer.ts.
  footer: {
    studio: "Studio",
    sitemap: "Sitemap",
    connect: "Vernetzen",
    legal: "Rechtliches",
    // The switcher column's heading, and the switcher's accessible name.
    language: "Sprache",
    links: {
      home: "Startseite",
      services: "Leistungen",
      about: "Über uns",
      contact: "Kontakt",
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutz",
    },
    copyright: "© {year} LineiQ. Alle Rechte vorbehalten.",
  },
  languageSwitcher: {
    label: "Sprache",
  },
  // Each page's title and description: the browser tab, the search result and
  // the link preview (Open Graph) all read these. The tagline in the home
  // title is the brand's own and stays English.
  meta: {
    pages: {
      "/": {
        title: "LineiQ | Brand. Code. Signal.",
        description:
          "Ein Studio für Marken- und Unternehmensarchitektur und ein Softwarehaus, in Ungarn aufgebaut, tätig für Unternehmen und Menschen überall.",
      },
      "/about": {
        title: "Über uns | LineiQ",
        description:
          "Ein Studio für Marken- und Unternehmensarchitektur, in Ungarn aufgebaut. Unsere Mission, die fünf Überzeugungen, nach denen wir arbeiten, und was sie uns kosten, die zwei Gründer dahinter und die Bücher, die uns prägen.",
      },
      "/work": {
        title: "Arbeiten | LineiQ",
        description:
          "Das LineiQ-Portfolio. Noch nicht: Die Fallstudien werden gerade geschrieben.",
      },
      "/contact": {
        title: "Kontakt | LineiQ",
        description:
          "Fünf Fragen, meist per Klick beantwortet. Wir lesen jede Antwort, bevor wir antworten.",
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
