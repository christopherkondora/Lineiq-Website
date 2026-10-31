import type { Dictionary } from "./en";

// The Hungarian dictionary, translated from the frozen English (Lineiq-Website#16)
// and typed against it, so a missing or extra key fails the type check.
//
// Claude's draft, for Kristóf and Áron to edit. The rules it follows: the
// glossary's Hungarian renderings (kontrast-vault strategy/glossary, agreed
// 2026-10-14), so our own named concepts (Dream Outcome Process, Academy, the
// framework names, the five category names) stay English and the sentence around
// them explains them; "partner", never "ügyfél", for the people we work with;
// tegezés, one visitor. Numbers are set the Hungarian way, a no-break space for
// the thousands and the currency after the figure.
//
// The Kranky marks and the proper nouns stay out of the dictionary, as in en.ts.

const hu: Dictionary = {
  home: {
    hero: {
      // Each word rises on its own; the last word carries the red dot.
      lineOne: "Felejtsd el az",
      lastWord: "átlagost",
    },
    intro: {
      lineOneBefore: "Egy márkaépítő",
      // "Ügynökség" is struck through by a red redaction, and "Stúdió" is
      // written over it letter by letter.
      struck: "Ügynökség",
      replacement: "Stúdió",
      lineOneAfter: "és szoftverház.",
      lineTwoHighlight: "Nem csupán",
      lineTwoRest: "kivitelezünk. Egyetlen weboldal is kutatással kezdődik.",
      lineThree: "Nevet építünk, amelyet egyedi szoftver és marketing",
      system: "támogat.",
      ecosystemBefore: "Egy",
      ecosystem: "világ",
      ecosystemAfter: "egyetlen céllal:",
      closing: "Hogy összetéveszthetetlenné tegyünk.",
    },
    work: {
      cursor: "Esettanulmány készül",
      allWork: "Minden munkánk",
      allWorkHover: "Nézzük",
      projects: {
        klient:
          "Projektek, számlázás és ügyfélkommunikáció egyetlen felületen. A szoftver, amelyet magunknak építettünk, mielőtt bárkinek eladtuk volna.",
        north:
          "Költségvetés-tervező iOS-alkalmazás, amitől a pénz nyugodtnak hat. Tiszta vizuális rendszer, gördülékeny natív interakciók, és egy folyamat, amely a mindennapi költést olyan szokássá alakítja, amelyet az emberek tényleg megtartanak.",
        miert:
          "Egy podcast, amelynek a márkája a kérdés. Szerkesztői rendszer, mozgásnyelv és vizuális hang, amely minden epizódban felismerhetően ugyanúgy szól.",
      },
    },
    partners: {
      // Word by word; the last word gets the red redaction.
      denial: "Nem vállalunk",
      denialMark: "ügyfeleket",
      // Followed by the Kranky "partners", which is not keyed.
      claim: "Hanem",
      columnOne: [
        "Ez a különbség: olyan stúdió, amelyet megtartasz, nem olyan szállító, amelyet lecserélsz. Bizalomra, következetességre és saját nézőpontra építve.",
        "Kíváncsiak, átláthatóak, ambiciózusak. És egy kicsit megszállottak azokkal a részletekkel, amelyeket a legtöbben észre sem vesznek.",
      ],
      columnTwo: [
        "Egy projekt, egy karbantartási csomag, és mindkettő mögött valódi kapcsolat. Felvesszük a telefont, és személyesen is megjelenünk.",
      ],
    },
    manifesto: {
      headingOne: "Nem vesztettük el az ízlésünket az AI miatt.",
      headingTwo: "Megtanítottuk neki a sajátunkat.",
      leadOneBefore: "Magyar stúdió,",
      // Held as one unbreakable run, then highlighted together with leadOneEnd.
      leadOneNoBreak: "nyugat-európai",
      leadOneEnd: "színvonalon.",
      leadTwoBefore: "Mindenki használ AI-t. A különbség a",
      mind: "gondolkodás",
      leadTwoMiddle: "és az",
      taste: "ízlés.",
      leadThree: "Márka, marketing és kód kreatív emberektől,",
      leadFourBefore: "műszaki és elméleti",
      expertise: "szakértelemmel.",
      imageAlt: "A LineiQ stúdió",
    },
    close: {
      headline: "Készen állsz?",
      cta: "Kezdjük el.",
      ctaHover: "Vágjunk bele!",
    },
  },
  about: {
    hero: {
      // Two sets of line breaks, one per measure; CSS shows one. Hungarian has
      // no hyphen in "rövid távú", so the red mark has nothing to land on and
      // the line sets plain; renderLine leaves a word without a hyphen alone.
      wideLines: [
        "Véget vetünk a",
        "rövid távú szemléletnek",
        "az építésre érdemes",
        "márkáknál.",
      ],
      narrowLines: [
        "Véget vetünk",
        "a rövid távú",
        "szemléletnek",
        "az építésre",
        "érdemes",
        "márkáknál.",
      ],
      hyphenated: "rövid távú",
    },
    origin: {
      paragraphs: [
        "Amióta csak figyeljük, a marketing saját magát falja fel. Minden évben új platform. Minden negyedévben új taktika. Minden héten egy újabb alapító, aki rájön, hogy amit hat hónapig épített, azt már felváltotta valami csillogóbb.",
        "Azért hoztuk létre a LineiQ-t, mert nem találtunk olyan stúdiót, amely azt a munkát végezte volna, amelyet mi végezni akartunk. Olyan munkát, amely kamatozik. Olyan márkákat, amelyek túlélik az építőiket. Olyan rendszereket, amelyek évről évre többet érnek, nem kevesebbet.",
      ],
    },
    compounds: {
      first: "A legtöbb marketing adó.",
      secondBefore: "A márka az egyetlen, ami",
      // The word that grows to fill the screen.
      word: "kamatozik",
      secondAfter: ".",
    },
    beliefs: {
      title: "Amiben hiszünk, és amibe ez nekünk kerül.",
      lead: "Ezek nem szlogenek, és nem alkudhatók. Az az elv, amely semmibe sem kerül, csak kényelmes meggyőződés, ezért az alábbiak mindegyike a számlájával együtt szerepel.",
      // Convictions verbatim from Beliefs (locked v1); costs condensed from the
      // matching House Rule. The rule each one traces to is in AboutBeliefs.
      items: {
        compounding: {
          conviction: "A kamatozás győz.",
          cost: "Havi 1 500 és 4 000 euró közötti egyszeri kampánymunkát utasítunk vissza, olyat, amiből a legtöbb stúdió él. Az átadás napján megszűnik fizetni.",
        },
        smallWorld: {
          conviction:
            "Inkább birtokolunk egy kis világot, mint hogy bérelnénk egy nagy piacot.",
          cost: "Valódi bevételről mondunk le, éppen azokban a hónapokban, amikor a legkevésbé engedhetjük meg.",
        },
        lastWork: {
          conviction:
            "Az utolsó munkánkkal versenyzünk, nem senki mással.",
          cost: "Újraépítünk olyan munkát is, amely már elég jó, és olyan órákat költünk rá, amelyeket más stúdiók zsebre vágnának.",
        },
        calm: {
          conviction: "A nyugalom a termék.",
          cost: "Kevesebbet és lassabban publikálunk, mint a tömeggyártó cégek. Nemet mondunk a könnyű mennyiségre.",
        },
        winWin: {
          conviction: "Mindkettőnknek jó, vagy nincs üzlet.",
          cost: "A KPI-kat írásban vállaljuk. Ha az első 30 napban nem teljesítjük őket, a következő hónapot mi álljuk.",
        },
      },
    },
    founders: {
      headingBefore: "Két alapító,",
      // The words the red band lands on.
      band: "egy hang.",
      // Four rows each, under ~40 characters (sources in data/founders.ts).
      lines: {
        "kondora-kristof": [
          "Két év ügyfélmunka.",
          "A Viltor.hu marketing- és SEO-partnere.",
          "Előbb a számokat nézi.",
          "A Klientet építette, a Northot tervezte.",
        ],
        "suto-aron": [
          "Megtervezte a munkafolyamatunkat.",
          "A 22 keretrendszerünk zöme.",
          "Piac- és ICP-kutatás.",
          "Pozicionálás, hangvétel, értékesítés.",
        ],
      },
      methodLabel: "A módszer, amelyen mindketten dolgozunk",
      // The framework names are our own named concepts and stay English; the
      // line under each one is the Hungarian explanation. The ROI Autopsy and
      // Future Walk lines follow DOP v3, as in the English.
      frameworks: {
        compoundVsTax: {
          name: "The Compound vs Tax Engine",
          line: "Minden elköltött euró vagy vagyont épít, vagy bérleti díjat fizet.",
        },
        stopPaying: {
          name: "The Stop-Paying Test",
          line: "Ha holnap abbahagynád a fizetést, megmaradna a munka?",
        },
        roiAutopsy: {
          name: "The ROI Autopsy",
          line: "Mielőtt bármit építenénk, megtaláljuk, hol hal el a jelenlegi költés.",
        },
        velvetRope: {
          name: "The Velvet Rope",
          line: "A mély munka megkezdése előtt szűrünk, nem utána.",
        },
        futureWalk: {
          name: "The Future Walk",
          line: "Az 1., 30., 90. és 365. napot végigjárjuk, mielőtt bármi elkészül.",
        },
      },
      // Two clauses, two lines.
      methodShapeOne:
        "{frameworks} keretrendszer közül öt, {layers} rétegben. A többi nem titok,",
      methodShapeTwo: "csak nem első benyomásnak valók.",
    },
    record: {
      label: "Az az egy dolog, amit nem szépítünk",
      title: "A LineiQ még soha nem publikált esettanulmányt.",
      lead: "Ez igaz, és nem fogjuk szépíteni. Az viszont nem ugyanaz, mint a nulláról indulni. Kristóf hozta az alábbi ügyfélmunkát. Áron írta meg a folyamat nagy részét, amellyel dolgozunk, és a huszonkét keretrendszer többségét, amelyen az fut, és övé a mögöttük álló kutatás. Más munka, nem más súly.",
      rosterLabel: "Ügyfelek és projektek",
      // One day a year (December 6 to 7) the two ages differ.
      ageSame: "Mindketten {age} évesek vagyunk.",
      ageDifferent: "Egyikünk {younger}, a másikunk {older} éves.",
      close:
        "A stúdió fiatalabb, mint a módszer, amelyen fut: az Academy és a Dream Outcome Process, a folyamatunk, még azelőtt elkészült, hogy bárki egyetlen eurót fizetett volna nekünk, mert nem vagyunk hajlandók olyan árat kérni, amelyet nem tudunk eljárással megindokolni. Két év múlva is tanulók leszünk. Azt az egyetlen dolgot, amit csinálunk, jól csináljuk.",
    },
    bookshelf: {
      title: "A könyvek, amelyek formálnak minket.",
      // What each book is to us. The signature under it is the founder's name,
      // in the order data/founders.ts gives for the language. The titles are
      // the books' own, as on the covers.
      books: {
        principles: {
          title: "Principles",
          commentary:
            "A LineiQ elveken fut, nem feltevéseken. Kit vállalunk, mennyiért dolgozunk, mit utasítunk vissza: mind le van írva, mielőtt szükség lenne rá, így egy döntés sem születik kétszer, és egy sem születik rossz héten.",
        },
        atomicHabits: {
          title: "Atomic Habits",
          commentary:
            "Ezért jár mindennel, amit építünk, egy mód arra, hogy tovább működjön. A cél az, amit bejelentesz; a rendszer az, ami olyan héten is fut, amelyen senki sem figyel. Az utóbbit építjük, magunknak és a partnereinknek is.",
        },
        zeroToOne: {
          title: "Zero to One",
          commentary:
            "Innen jön, hogy nem akarunk újabb ügynökség lenni. A feladat nem az, hogy megnyerjünk egy kategóriát, hanem az, hogy mi legyünk az egyetlen benne. Ez a mérce nekünk és minden márkának, amelyet építünk: ha egy versenytárs ráteheti a saját logóját, akkor még nem kész.",
        },
        hardThing: {
          title: "The Hard Thing About Hard Things",
          commentary:
            "Ez ad jogot arra, hogy a kényelmes helyett a nehéz beszélgetést vállaljuk. Egy cég építése nem kínál jó válaszokat, csak kevésbé rosszakat. Előbb a valódi problémát nevezzük meg, még ha nem az is, amelyet remélted, hogy megtalálunk.",
        },
        deepWork: {
          title: "Deep Work",
          commentary:
            "Ezért dolgozunk mélyen, nem szélesen. Nincs Slack-áradat, nincs meetingmaraton, nincs kérdéscsepegtetés a postafiókodba: a megfelelő pillanatokban kérdezünk, és csak akkor. A nyugalom nem a folyamat extrája, hanem maga a folyamat.",
        },
      },
    },
    close: {
      headingOne: "Ha ez megszólít,",
      headingTwo: "beszéljünk.",
      cta: "Kezdjük el.",
      ctaHover: "Vágjunk bele!",
    },
  },
  services: {
    // The frame every category page shares.
    allServices: "Minden szolgáltatás",
    includes: "Mit tartalmaz",
    // Dream Outcome Process stays English; the sentence is its explanation.
    processNote:
      "Minden közös munkánk a Dream Outcome Process mentén halad. Előbb a kutatás, a célügyfeled és a pozicionálásod jön; a munka ezekre épül.",
    // Followed by the next category's name.
    next: "Következő",
    // Followed by the remaining categories' names.
    or: "Vagy:",
    cta: "Kezdjük el.",
    ctaHover: "Beszéljünk!",
    // The category names are our own named concepts and stay English (glossary);
    // the intro under each is the Hungarian explanation.
    //
    // Intros carry *highlight* markers around the words the design can set as
    // oversized Fraunces inline (introSegments in data/services.ts).
    categories: {
      "brand-architecture": {
        title: "Brand Architecture",
        intro:
          "Egy márka *alapjai*, a stratégiától a vizuális rendszerig, egy kézben, vállalatoknak és magánszemélyeknek, hogy *felismerhetővé* váljon.",
        subServices: {
          research: {
            title: "Közönség-, piac- és versenytárskutatás",
            desc: "Kivel beszélsz, mit akarnak hallani, és ki más beszél hozzájuk.",
          },
          positioning: {
            title: "Pozicionálás és stratégia",
            desc: "Hol állsz a piacon, és az egy mondat, amiért téged érdemes választani.",
          },
          brandWorld: {
            title: "Márkavilág és hangvétel",
            desc: "A történet, az alapítói történet és a hang, amelyen a márka mindenhol megszólal.",
          },
          naming: {
            title: "Névadás",
            desc: "Cég-, termék- és kampánynevek, amelyek megragadnak.",
          },
          identity: {
            title: "Logó és arculat",
            desc: "Az elsődleges jel és az egész rendszer, amely köré épül.",
          },
          designSystem: {
            title: "Vizuális nyelv és designrendszer",
            desc: "Színek, tipográfia, rács és komponensek egyben, márkakézikönyvvel.",
          },
          rebranding: {
            title: "Rebranding",
            desc: "Egy meglévő márka újrapozicionálása és megújítása.",
          },
          maintenance: {
            title: "Karbantartási csomag",
            desc: "Az irányelvek naprakészen tartása, új anyagok a rendszeren belül.",
          },
        },
      },
      "web-development": {
        title: "Web Development",
        intro:
          "Egyedi, animált oldalak Next.js-re és a márka alapjaira építve, villámgyorsak, és *élnek* a kezed alatt.",
        subServices: {
          bespokeSite: {
            title: "Egyedi weboldal-fejlesztés",
            desc: "Nincsenek sablonok, a márkádra építjük.",
          },
          webDesign: {
            title: "Webdesign (UI/UX)",
            desc: "Felület, amelyet elsőre megértenek az emberek.",
          },
          motion: {
            title: "Mozgás és animáció",
            desc: "GSAP, Lenis, mozgás, amely megkülönböztet.",
          },
          copy: {
            title: "Weboldal-szövegírás",
            desc: "A pozicionálásodból és a vevőid saját szavaiból írva.",
          },
          landingPages: {
            title: "Landing- és kampányoldalak",
            desc: "Egy cél, egy üzenet, semmi, ami útban van.",
          },
          multilingual: {
            title: "Többnyelvű weboldalak",
            desc: "Minden nyelven, amelyen a vevőid olvasnak.",
          },
          cms: {
            title: "CMS-integráció",
            desc: "Tartalom, amelyet fejlesztő nélkül, magad kezelsz.",
          },
          performance: {
            title: "Teljesítmény és technikai SEO",
            desc: "Gyors betöltés, Core Web Vitals, kereshető szerkezet.",
          },
          maintenance: {
            title: "Karbantartási csomag",
            desc: "Az oldal élő, naprakész és biztonságos marad.",
          },
        },
      },
      ecommerce: {
        title: "Ecommerce",
        intro:
          "Webshopok, amelyek nemcsak jól néznek ki, hanem *eladnak*, a termékoldaltól a számláig és a *visszatérő* vevőig.",
        subServices: {
          webshop: {
            title: "Webshop-építés",
            desc: "Saját webshoprendszerünk bejelentkezős adminnal, és a márkádra szabott kirakat.",
          },
          shopUx: {
            title: "Shop UX és termékoldal-tervezés",
            desc: "A vásárlási út és a termékoldalak, amelyek a kosárhoz vezetnek.",
          },
          catalogue: {
            title: "Katalógusfeltöltés és termékszövegek",
            desc: "A teljes kínálatod bent, a vevőid saját szavaival leírva.",
          },
          paymentShipping: {
            title: "Fizetési és szállítási integráció",
            desc: "Magyar és nemzetközi megoldások bekötve.",
          },
          invoicing: {
            title: "Számlázási integráció",
            desc: "Számlázz.hu, Billingo és nemzetközi megfelelőik, automatikusan összekötve.",
          },
          analytics: {
            title: "Analitika és konverziókövetés",
            desc: "Minden eladás visszakövethető oda, ahonnan jött.",
          },
          upkeep: {
            title: "Webshop-gondozás és konverzióoptimalizálás",
            desc: "Indulás után havi tölcsér-áttekintés és kiszállított fejlesztések.",
          },
        },
      },
      "software-solutions": {
        title: "Software Solutions",
        intro:
          "Webalkalmazások, *iOS és Android* alkalmazások, portálok és belső eszközök, ugyanabból a *DNS*-ből, amelyből a saját platformunkat építettük.",
        subServices: {
          webApp: {
            title: "Webalkalmazás-fejlesztés",
            desc: "A SaaS, belső eszköz, portál vagy dashboard, amire szükséged van.",
          },
          mobileApp: {
            title: "Mobilalkalmazás-fejlesztés (iOS és Android)",
            desc: "Hüvelykujjra tervezett alkalmazás az ötlettől az áruházi indulásig.",
          },
          productDesign: {
            title: "Termék UI/UX-tervezés",
            desc: "Termékfelület, amely magától értetődő.",
          },
          mvp: {
            title: "MVP-fejlesztés",
            desc: "Működő első verzió, gyorsan a piacon.",
          },
          integration: {
            title: "API és integráció",
            desc: "A rendszereid végre beszélnek egymással.",
          },
          aiFeatures: {
            title: "AI-funkciók",
            desc: "Asszisztensek, keresés és összefoglalók a szoftveren belül, ahol segítenek.",
          },
          maintenance: {
            title: "Karbantartási csomag",
            desc: "Hibajavítások, javítócsomagok és kisebb fejlesztések. Az új funkciók külön projektek.",
          },
        },
      },
      "strategic-marketing": {
        title: "Strategic Marketing",
        intro:
          "Hol és miért jelenik meg a márka, fizetett és organikus csatornákon, *mérhető* célokkal, hogy *növekedjen*.",
        subServices: {
          channelStrategy: {
            title: "Kampány- és csatornastratégia",
            desc: "Egységes terv a csatornákon át, mérhető célokkal.",
          },
          organicSocial: {
            title: "Organikus social stratégia",
            desc: "Az az egy csatorna, ahol a vevőid vannak, és hogyan jelenj meg ott.",
          },
          contentIdeas: {
            title: "Tartalmi ötletek és forgatókönyvek",
            desc: "Ötletek, forgatókönyvek és szövegek a te hangodon, havi naptárban.",
          },
          paidAds: {
            title: "Fizetett hirdetés (Meta, Google)",
            desc: "Hirdetések, amelyek bevételt hoznak, nem csak kattintást.",
          },
          email: {
            title: "E-mail marketing",
            desc: "A lista, amely a tiéd marad, és vevőkké válik.",
          },
          reporting: {
            title: "Mérés, jelentés és stratégia",
            desc: "Rendesen mérve, havonta jelentve, stratégiai megbeszéléssel.",
          },
        },
      },
    },
  },
  work: {
    // After the ◆ the page sets in front of it.
    label: "Portfólió",
    // Struck through on the page and answered by the Kranky "not yet.", which
    // is a mark and stays in code.
    titleLines: ["A munka, amelyre", "a nevünket adjuk."],
    lede: "Az esettanulmányok készülnek. Inkább semmit nem mutatunk, mint valami félkészet.",
    cta: "Beszéljünk?",
    ctaHover: "Vágjunk bele!",
    back: "Vissza a főoldalra",
  },
  // The contact flow (contact/ContactFlow). The ids behind the labels are the
  // same in every language; only these labels differ. The budget figures are
  // still euros, set the Hungarian way: forints on /hu come with
  // Lineiq-Website#13, once Kristóf sets the amounts.
  contact: {
    heading: "Beszéljünk komolyan.",
    lede: "Öt kérdés. Minden választ elolvasunk, mielőtt válaszolunk.",
    begin: "Kezdés",
    beginHover: "Vágjunk bele!",
    aside: "Vagy csak írj nekünk.",
    // One per counted panel; the statement and the review are not questions.
    questions: {
      who: "Ki vagy?",
      stage: "Hogy áll most a bevétel?",
      need: "Mire van szükséged?",
      budget: "Mekkora keretet tudsz mögé tenni?",
      note: "Van még valami, amit tudnunk kell?",
    },
    company: "Cég",
    email: "E-mail",
    next: "Tovább",
    // The note's button while the note is empty.
    skip: "Kihagyom",
    optional: "Nem kötelező",
    stages: {
      "not-selling": "Még nem adunk el",
      inconsistent: "Eladunk, de nem egyenletesen",
      "selling-well": "Jól megy, többet szeretnénk",
    },
    needs: {
      grow: "Növekedés",
      rebrand: "Rebranding",
      remarket: "A marketing újragondolása",
      launch: "Valami új indítása",
    },
    monthly: "Havi",
    oneTime: "Egyszeri",
    // The budget switch's accessible name.
    switchLabel: "Az egyszeri keretek mutatása a havi helyett",
    // Four per mode, so the grid does not reflow.
    bands: {
      monthly: {
        "mo-under-2k": "2 000 € alatt / hó",
        "mo-2-5k": "2 000 – 5 000 € / hó",
        "mo-5-10k": "5 000 – 10 000 € / hó",
        "mo-10k-up": "10 000 € felett / hó",
      },
      "one-time": {
        "ot-under-15k": "15 000 € alatt",
        "ot-15-30k": "15 000 – 30 000 €",
        "ot-30-75k": "30 000 – 75 000 €",
        "ot-75k-up": "75 000 € felett",
      },
    },
    review: {
      heading: "Ennyit tudunk eddig.",
      company: "Cég",
      email: "E-mail",
      stage: "Bevétel",
      need: "Igény",
      budget: "Keret",
      note: "Megjegyzés",
      notAnswered: "Nincs válasz",
      change: "Módosítás",
    },
    send: "Küldés",
    sending: "Küldés…",
    sendHover: "Vágjunk bele!",
    back: "Vissza",
    // Beside the send button: the privacy notice, where the data is given.
    privacyLink: "Hogyan kezeljük a válaszaidat",
    // Keyed by the codes in contact/intake.ts (INTAKE_ERRORS). company and
    // email are also what the flow says before it lets the visitor past the
    // first question.
    errors: {
      company: "Szükségünk van a cég nevére, hogy tudjuk, kivel beszélünk.",
      email:
        "Érvényes e-mail-címre van szükségünk, hogy legyen hová válaszolnunk.",
      steps: "Válaszolj minden lépésre, és lesz miből dolgoznunk.",
      budget: "Válassz egy keretet, és lesz miből dolgoznunk.",
      unavailable: "Az e-mail-szolgáltatás nincs beállítva.",
      failed: "A küldés nem sikerült, kérjük, próbáld újra.",
    },
    done: {
      title: "Megkaptuk.",
      nextLabel: "Következő lépés",
      next: "A válaszaidat a piacodhoz mérve olvassuk el, és úgy érkezünk az első hívásra, hogy már van mondanivalónk.",
      responseLabel: "Válaszidő",
      response: "Munkanapokon 48 órán belül jelentkezünk e-mailben.",
    },
  },
  nav: {
    links: {
      home: "Főoldal",
      services: "Szolgáltatások",
      about: "Rólunk",
      contact: "Kapcsolat",
    },
    openMenu: "Menü megnyitása",
    closeMenu: "Menü bezárása",
    cta: "Beszéljünk?",
    ctaHover: "Vágjunk bele!",
  },
  // Both footers read this: components/Footer and the overlay on Home's closing
  // sequence (components/SequenceSection). The links, the channel names and the
  // company name are in data/footer.ts.
  footer: {
    studio: "Stúdió",
    sitemap: "Oldaltérkép",
    connect: "Kapcsolat",
    legal: "Jogi",
    // The switcher column's heading, and the switcher's accessible name.
    language: "Nyelv",
    links: {
      home: "Főoldal",
      services: "Szolgáltatások",
      about: "Rólunk",
      contact: "Kapcsolat",
      terms: "Feltételek",
      privacy: "Adatkezelés",
    },
    copyright: "© {year} LineiQ. Minden jog fenntartva.",
  },
  languageSwitcher: {
    label: "Nyelv",
  },
  meta: {
    pages: {
      "/": {
        title: "LineiQ | Brand. Code. Signal.",
        description:
          "Márka- és üzletarchitektúra-stúdió és szoftverház, Magyarországon épült, vállalatokkal és magánszemélyekkel dolgozik bárhol a világon.",
      },
      "/about": {
        title: "Rólunk | LineiQ",
        description:
          "Magyarországon épült márka- és üzletarchitektúra-stúdió. A küldetésünk, az öt meggyőződés, amelyen futunk, és amibe ez nekünk kerül, a két alapító mögötte, és a könyvek, amelyek formálnak minket.",
      },
      "/work": {
        title: "Munkák | LineiQ",
        description:
          "A LineiQ portfóliója. Még nem: az esettanulmányok készülnek.",
      },
      "/contact": {
        title: "Kapcsolat | LineiQ",
        description:
          "Öt kérdés, többnyire kattintással megválaszolva. Minden választ elolvasunk, mielőtt válaszolunk.",
      },
      // Already in Hungarian, like the legal pages themselves (data/legal).
      "/terms": {
        title: "Felhasználási feltételek | LineiQ",
        description:
          "A lineiqgroup.com használatának feltételei: ki üzemelteti, mi a weboldal és mi nem, és a tartalmára vonatkozó szabályok.",
      },
      "/privacy": {
        title: "Adatkezelési tájékoztató | LineiQ",
        description:
          "Hogyan kezeli a LineiQ a lineiqgroup.com-on megadott adatokat: a kapcsolatfelvételi űrlap, egyetlen nyelvi süti, analitika nélkül.",
      },
    },
    // A category page's title; its description is the category's intro.
    serviceTitle: "{title} | LineiQ",
  },
};

export default hu;
