// Single source of truth for the service taxonomy. Drives the homepage index
// (Process) and each /mit-nyujtunk/[slug] category page.
// Content mirrors vault/projects/lineiqgroup.com/szolgaltatas_taxonomia.md.
//
// Intro strings carry *kiemelés* markers: the category page renders the marked
// words as oversized Fraunces inline (the Intro/Manifesto mixed-typography
// idiom). Everywhere plain text is needed, run them through plainIntro().

export interface SubService {
  title: string;
  desc: string;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  essence: string; // Kranky one-word signature
  intro: string;
  teaser: string[]; // short labels for the homepage hover reveal (max 3)
  subServices: SubService[];
}

export const services: ServiceCategory[] = [
  {
    slug: "brand-epites",
    title: "Brand építés",
    essence: "soul.",
    intro:
      "A márka *alapjai* a stratégiától a vizuális rendszerig, egy kézben, hogy *felismerhető* és elkerülhetetlen legyen.",
    teaser: ["Pozicionálás és stratégia", "Brand narratíva", "Logó és arculat"],
    subServices: [
      {
        title: "Pozicionálás és stratégia",
        desc: "Hol állsz a piacon, és milyen egy mondatban megfogalmazható okból válasszanak téged.",
      },
      {
        title: "Célcsoport és piackutatás",
        desc: "Kinek beszélsz, mit akar hallani, és hol éred el.",
      },
      {
        title: "Brand narratíva és hangvétel",
        desc: "A történet és a hang, amin a márka mindenhol megszólal.",
      },
      {
        title: "Naming",
        desc: "Cég-, termék- és kampánynevek, amik megragadnak.",
      },
      {
        title: "Logó és arculat",
        desc: "Az elsődleges jel és a köré épülő teljes rendszer.",
      },
      {
        title: "Vizuális nyelv és design rendszer",
        desc: "Színek, tipográfia, grid és komponensek egységben, arculati kézikönyvvel.",
      },
      {
        title: "Csomagolásdesign",
        desc: "A termék, ami a polcon is elad.",
      },
      {
        title: "Újrabrandelés",
        desc: "Meglévő márka újrapozicionálása és felfrissítése.",
      },
    ],
  },
  {
    slug: "web-fejlesztes",
    title: "Web fejlesztés",
    essence: "craft.",
    intro:
      "Next.js-re épített, animált, *awwwards-szintű* oldalak, amik villámgyorsak és *élnek* a kéz alatt.",
    teaser: ["Egyedi weboldal", "Webdesign (UI/UX)", "Awwwards animáció"],
    subServices: [
      {
        title: "Egyedi weboldal fejlesztés",
        desc: "Sablonmentes, a márkádra szabott oldal.",
      },
      {
        title: "Webdesign (UI/UX)",
        desc: "A felület megtervezése, ami érthető és konvertál.",
      },
      {
        title: "Awwwards-szintű animáció",
        desc: "GSAP, Lenis, mozgás, ami megkülönböztet.",
      },
      {
        title: "Landing page és kampányoldal",
        desc: "Egy cél, egy üzenet, maximális konverzió.",
      },
      {
        title: "CMS integráció",
        desc: "Tartalom, amit magad kezelsz, fejlesztő nélkül.",
      },
      {
        title: "Teljesítmény és technikai SEO",
        desc: "Gyors betöltés, Core Web Vitals, kereshető szerkezet.",
      },
      {
        title: "Karbantartás és support",
        desc: "Az oldal él, frissül és biztonságban van.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "eCommerce",
    essence: "sell.",
    intro:
      "Webshopok, amik nem csak jól néznek ki, hanem *konvertálnak*, a kosártól a *visszatérő* vásárlóig.",
    teaser: ["Webshop fejlesztés", "Webshop UX design", "Shopify setup"],
    subServices: [
      {
        title: "Webshop fejlesztés",
        desc: "Egyedi vagy platformra épített bolt, ami elad.",
      },
      {
        title: "Webshop UX és termékoldal design",
        desc: "A vásárlási út és a termékoldalak, amik a kosárig vezetnek.",
      },
      {
        title: "Shopify és platform setup",
        desc: "Gyors indulás bevált alapokon.",
      },
      {
        title: "Fizetés és szállítás integráció",
        desc: "Magyar és nemzetközi megoldások bekötve.",
      },
      {
        title: "Számlázási integráció",
        desc: "Számlázz.hu, Billingo és más rendszerek automata bekötése.",
      },
      {
        title: "Konverzióoptimalizálás (CRO)",
        desc: "Adatból fakadó finomítás, folyamatosan.",
      },
    ],
  },
  {
    slug: "web-es-mobil-alkalmazasok",
    title: "Web & telefonos alkalmazások",
    essence: "ship.",
    intro:
      "Egyedi szoftver és mobilappok ugyanabból a *DNS-ből*, amiből a saját *Klient* platformunkat építettük.",
    teaser: ["Webalkalmazás", "App UI/UX design", "Mobilapp"],
    subServices: [
      {
        title: "Webalkalmazás fejlesztés",
        desc: "SaaS, belső eszköz vagy ügyfélportál, amire szükséged van.",
      },
      {
        title: "App UI/UX design",
        desc: "A termék felülete, ami magától érthető.",
      },
      {
        title: "Mobilalkalmazás (iOS és Android)",
        desc: "Egy kódbázis, két platform.",
      },
      {
        title: "MVP fejlesztés",
        desc: "A működő első verzió, gyorsan piacra.",
      },
      {
        title: "API és integráció",
        desc: "A rendszereid, amik végre beszélnek egymással.",
      },
      {
        title: "Karbantartás és továbbfejlesztés",
        desc: "A termék nem áll meg a launchnél.",
      },
    ],
  },
  {
    slug: "marketing",
    title: "Marketing",
    essence: "grow.",
    intro:
      "A márka él, hat és *növekszik*, fizetett és organikus csatornákon, *mérhető* célokkal.",
    teaser: ["Fizetett hirdetések", "Organikus közösségi média", "SEO"],
    subServices: [
      {
        title: "Fizetett hirdetések (Meta, Google)",
        desc: "A hirdetések, amik bevételt hoznak, nem csak kattintást.",
      },
      {
        title: "Organikus közösségi média",
        desc: "Tartalom és jelenlét, ami közösséget épít.",
      },
      {
        title: "SEO és tartalommarketing",
        desc: "Folyamatos kereshetőség és tartalom, ami behoz.",
      },
      {
        title: "Email marketing",
        desc: "A lista, ami a tiéd marad, és vásárlóvá tesz.",
      },
      {
        title: "Kampánystratégia",
        desc: "Egységes terv a csatornák fölött, mérhető célokkal.",
      },
    ],
  },
];

export function getService(slug: string): ServiceCategory | undefined {
  return services.find((s) => s.slug === slug);
}

export interface IntroSegment {
  text: string;
  highlight: boolean;
}

// Odd-indexed pieces sit between *markers*, those are the highlighted words.
export function introSegments(intro: string): IntroSegment[] {
  return intro
    .split("*")
    .map((text, i) => ({ text, highlight: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
}

export function plainIntro(intro: string): string {
  return intro.split("*").join("");
}
