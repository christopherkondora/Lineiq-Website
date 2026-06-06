import type { Metadata } from "next";
import styles from "./styleguide.module.css";
import CtaSwap from "../components/CtaSwap";

export const metadata: Metadata = {
  title: "Styleguide — LineiQ",
  description: "Élő vizuális referencia a LineiQ design rendszerhez.",
  robots: { index: false, follow: false },
};

type Color = { token: string; hex: string; name: string; note?: string };

const baseColors: Color[] = [
  { token: "--color-white", hex: "#FFFFFF", name: "Fehér", note: "Alap háttér" },
  { token: "--color-black", hex: "#000000", name: "Fekete", note: "Szöveg, dark szekciók" },
  { token: "--color-red", hex: "#DA0303", name: "Piros", note: "Brand hang, vonalak, reveal" },
];

const grayColors: Color[] = [
  { token: "--color-surface", hex: "#F4F4F4", name: "Felület", note: "Kártya háttér" },
  { token: "--color-border", hex: "#E0E0E0", name: "Keret", note: "Elválasztó vonalak" },
  { token: "--color-muted", hex: "#A0A0A0", name: "Tompa szöveg", note: "Másodlagos szöveg" },
];

const sizes = [
  { token: "--text-xs", size: "0.75rem", px: "12px", opsz: 22 },
  { token: "--text-sm", size: "0.875rem", px: "14px", opsz: 26 },
  { token: "--text-base", size: "1rem", px: "16px", opsz: 32 },
  { token: "--text-lg", size: "1.125rem", px: "18px", opsz: 38 },
  { token: "--text-xl", size: "1.25rem", px: "20px", opsz: 42 },
  { token: "--text-2xl", size: "1.5rem", px: "24px", opsz: 52 },
  { token: "--text-3xl", size: "1.875rem", px: "30px", opsz: 62 },
  { token: "--text-4xl", size: "2.25rem", px: "36px", opsz: 72 },
  { token: "--text-5xl", size: "3rem", px: "48px", opsz: 90 },
  { token: "--text-6xl", size: "3.75rem", px: "60px", opsz: 110 },
  { token: "--text-7xl", size: "4.5rem", px: "72px", opsz: 125 },
  { token: "--text-8xl", size: "6rem", px: "96px", opsz: 144 },
];

const spaces = [
  { token: "--space-xs", value: "4px" },
  { token: "--space-sm", value: "8px" },
  { token: "--space-md", value: "16px" },
  { token: "--space-lg", value: "32px" },
  { token: "--space-xl", value: "64px" },
  { token: "--space-2xl", value: "96px" },
  { token: "--space-3xl", value: "128px" },
];

const motionTiles: { ease: string; duration: string; label: string }[] = [
  { ease: "inout", duration: "slow",    label: "in-out · slow (700ms)" },
  { ease: "inout", duration: "slower",  label: "in-out · slower (1200ms)" },
  { ease: "inout", duration: "slowest", label: "in-out · slowest (1800ms)" },
  { ease: "expo",  duration: "slow",    label: "expo · slow (700ms)" },
  { ease: "expo",  duration: "slower",  label: "expo · slower (1200ms)" },
  { ease: "expo",  duration: "slowest", label: "expo · slowest (1800ms)" },
];

function ColorSwatch({ color, dark = false }: { color: Color; dark?: boolean }) {
  return (
    <div className={styles.swatch}>
      <div
        className={styles.swatchBlock}
        style={{ backgroundColor: `var(${color.token})` }}
      />
      <div className={styles.swatchMeta} style={dark ? { background: "var(--color-black)", color: "var(--color-white)" } : undefined}>
        <span className={styles.swatchName}>{color.name}</span>
        <span className={styles.swatchToken}>{color.token}</span>
        <span className={styles.swatchHex}>{color.hex}</span>
        {color.note && <span className={styles.swatchToken}>{color.note}</span>}
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={`text-label ${styles.eyebrow}`}>Styleguide · v1.0</p>
          <h1 className={styles.title}>Vizuális rendszer</h1>
          <p className={styles.lead}>
            Élő referencia a LineiQ weboldal design tokenjeihez, komponenseihez és mozgásrendszeréhez. Minden szín, méret és animáció a tényleges CSS változókat olvassa, így ez az oldal mindig az aktuális állapotot mutatja, nem egy másolatot.
          </p>
        </header>

        {/* ─── 01 Színek ──────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>01</span>
            <div>
              <h2 className={styles.sectionTitle}>Színrendszer</h2>
              <p className={styles.sectionNote}>
                A piros a brand hangja és az egyetlen szín a fekete-fehér alap mellett. A szürkék funkcionálisak, nem dekoratívak.
              </p>
            </div>
          </div>

          <div className={styles.colorGrid}>
            {baseColors.map((c) => (
              <ColorSwatch key={c.token} color={c} />
            ))}
          </div>

          <div style={{ height: "var(--space-lg)" }} />

          <div className={styles.colorGrid}>
            {grayColors.map((c) => (
              <ColorSwatch key={c.token} color={c} />
            ))}
          </div>
        </section>

        {/* ─── 02 Tipográfiai szerepek ─────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>02</span>
            <div>
              <h2 className={styles.sectionTitle}>Tipográfiai szerepek</h2>
              <p className={styles.sectionNote}>
                Három font, három feladat. Fraunces a display, Wix Madefor a funkció, Kranky a szignatúra. A Kranky kizárólag angol szóra, soha bekezdésre.
              </p>
            </div>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Hero</span>
              <span className={styles.typeToken}>.text-hero · Fraunces</span>
            </div>
            <div className={`${styles.typeSample} text-hero`}>Forget being ordinary</div>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Statement</span>
              <span className={styles.typeToken}>.text-statement · Fraunces</span>
            </div>
            <div className={`${styles.typeSample} text-statement`}>
              The algorithm got cheap. Taste didn&apos;t.
            </div>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Section</span>
              <span className={styles.typeToken}>.text-section · Fraunces</span>
            </div>
            <div className={`${styles.typeSample} text-section`}>
              Egyetlen csomag, nem à la carte
            </div>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Signature</span>
              <span className={styles.typeToken}>.text-signature · Kranky</span>
            </div>
            <div className={`${styles.typeSample} text-signature`}>signature</div>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Body</span>
              <span className={styles.typeToken}>.text-body · Wix Madefor</span>
            </div>
            <p className={styles.typeSample} style={{ maxWidth: "62ch" }}>
              A LineiQ vizuális rendszere két erő egyensúlyán alapul, precizitás és személyiség. Az architektúra geometrikus és kontrollált, a brand aláírása viszont emberkéz nyomát viseli.
            </p>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Nav</span>
              <span className={styles.typeToken}>.text-nav · Wix Madefor</span>
            </div>
            <div className={`${styles.typeSample} text-nav`}>Munkáink · Mit nyújtunk · Rólunk</div>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Label</span>
              <span className={styles.typeToken}>.text-label · Wix Madefor</span>
            </div>
            <div className={`${styles.typeSample} text-label`}>Studio · Budapest, HU</div>
          </div>
        </section>

        {/* ─── 03 Méretskála ──────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>03</span>
            <div>
              <h2 className={styles.sectionTitle}>Méretskála</h2>
              <p className={styles.sectionNote}>
                A teljes type scale Fraunces-ben szedve, hogy a karakter egyben látható legyen. A Fraunces optikai tengelye (opsz) a mérettel együtt nő, a nagy display méret kapja a vékony, magas kontrasztú vonalakat, a kicsi marad testes és olvasható. Body szövegnél Wix Madefort használj, ugyanezzel a méretskálával.
              </p>
            </div>
          </div>

          {sizes.map((s) => (
            <div key={s.token} className={styles.scaleRow}>
              <span className={styles.scaleToken}>{s.token}</span>
              <span className={styles.scaleSize}>
                {s.size} · {s.px} · opsz {s.opsz}
              </span>
              <span
                className={styles.scaleSample}
                style={{
                  fontSize: `var(${s.token})`,
                  fontVariationSettings: `"opsz" ${s.opsz}`,
                }}
              >
                Aa Bb 123
              </span>
            </div>
          ))}
        </section>

        {/* ─── 04 Térrendszer ─────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>04</span>
            <div>
              <h2 className={styles.sectionTitle}>Spacing</h2>
              <p className={styles.sectionNote}>
                Hét lépéses skála négy pixeltől 128 pixelig. A szekciók között <code>--space-xl</code> és <code>--space-2xl</code> dominál, a zsúfoltság elkerülése tudatos.
              </p>
            </div>
          </div>

          {spaces.map((s) => (
            <div key={s.token} className={styles.spaceRow}>
              <span className={styles.scaleToken}>{s.token}</span>
              <span className={styles.scaleSize}>{s.value}</span>
              <span className={styles.spaceBar} style={{ width: `var(${s.token})` }} />
            </div>
          ))}
        </section>

        {/* ─── 05 Radius ──────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>05</span>
            <div>
              <h2 className={styles.sectionTitle}>Sarokrendszer</h2>
              <p className={styles.sectionNote}>
                A komponensek geometrikusak és élesek, az ívet a Fraunces és a Kranky viseli. A pill kizárólag gombokon és kis kontraszt elemeken jelenik meg.
              </p>
            </div>
          </div>

          <div className={styles.radiusGrid}>
            <div className={styles.radiusTile} style={{ borderRadius: "var(--radius-none)" }}>
              <span className={styles.radiusLabel}>--radius-none · 0</span>
            </div>
            <div className={styles.radiusTile} style={{ borderRadius: "var(--radius-sm)" }}>
              <span className={styles.radiusLabel}>--radius-sm · 4px</span>
            </div>
            <div className={styles.radiusTile} style={{ borderRadius: "var(--radius-pill)" }}>
              <span className={styles.radiusLabel}>--radius-pill · 999px</span>
            </div>
          </div>
        </section>

        {/* ─── 06 Gombok ──────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>06</span>
            <div>
              <h2 className={styles.sectionTitle}>Gombok</h2>
              <p className={styles.sectionNote}>
                Egy gomb van: a highlight-swap. Egy fekete kihúzás takarja a szót, majd betűről betűre felhozza a másodlagos címkét, sötét háttéren a kihúzás fehér és a hover szöveg fekete. Vidd fölé a kurzort, hogy lásd a mozgást.
              </p>
            </div>
          </div>

          <div className={styles.buttonStage}>
            <div className={styles.buttonRow}>
              <a href="#" className={styles.swapButton}>
                <CtaSwap defaultLabel="Beszéljünk?" hoverLabel="Vágjunk bele!" />
              </a>
            </div>

            <div className={`${styles.buttonRow} ${styles.buttonRowDark} section--dark`}>
              <a href="#" className={styles.swapButton}>
                <CtaSwap defaultLabel="Beszéljünk?" hoverLabel="Vágjunk bele!" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── 07 Motion ──────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>07</span>
            <div>
              <h2 className={styles.sectionTitle}>Mozgás</h2>
              <p className={styles.sectionNote}>
                Súly és nyugalom, nem sebesség. A leglassabb in-out a brand belégzése, az expo a markánsabb belépő. Gyors mozdulatot itt nem használunk, a tempó maga a kultúra. Vidd fölé a csempét, hogy lásd a görbét.
              </p>
            </div>
          </div>

          <div className={styles.motionGrid}>
            {motionTiles.map((m) => (
              <div
                key={m.label}
                className={styles.motionTile}
                data-ease={m.ease}
                data-duration={m.duration}
                tabIndex={0}
              >
                <div className={styles.motionLabel}>
                  <span>{m.label}</span>
                  <span>hover</span>
                </div>
                <div className={styles.motionTrack}>
                  <span className={styles.motionDot} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 08 Vonalak ─────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>08</span>
            <div>
              <h2 className={styles.sectionTitle}>Vonalrendszer</h2>
              <p className={styles.sectionNote}>
                A vonal a brand alapeleme, de ritkán szól. Egy szekcióban csak egy típus él, és az is csak ott, ahol a kompozíció elbírja. A piros az egyetlen szín, a sűrűség pedig mindig alacsony.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "var(--space-lg)", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div className={styles.lineSample}>
              <svg className={styles.ambientLine} viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 70 Q 100 30, 200 70 T 400 70" />
                <path d="M0 110 Q 100 70, 200 110 T 400 110" />
              </svg>
              <span className={styles.lineCaption}>Ambient — két hullám fáziseltolódással</span>
            </div>

            <div className={styles.lineSample}>
              <div className={styles.narrativeLine}>
                <span />
              </div>
              <span className={styles.lineCaption}>Narrative — scroll-triggered, egyirányú</span>
            </div>

            <div className={styles.lineSample}>
              <svg className={styles.radialCluster} viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true">
                {Array.from({ length: 14 }).map((_, i) => {
                  const x = 20 + i * 12;
                  const len = 30 + Math.sin((i / 13) * Math.PI) * 80;
                  const y2 = 130;
                  const y1 = y2 - len;
                  return <line key={i} x1={x} y1={y1} x2={x} y2={y2} style={{ animationDelay: `${i * 90}ms` }} />;
                })}
              </svg>
              <span className={styles.lineCaption}>Radial — sugárzó csoport, sarokba</span>
            </div>

            <div className={styles.lineSample}>
              <div className={styles.cascadeLines} aria-hidden="true">
                <span /><span /><span /><span /><span /><span /><span />
              </div>
              <span className={styles.lineCaption}>Cascade — lépcsős vonalak, hullámzva</span>
            </div>
          </div>
        </section>

        {/* ─── 09 Dark szekció ────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>09</span>
            <div>
              <h2 className={styles.sectionTitle}>Dark szekció</h2>
              <p className={styles.sectionNote}>
                Nincs dark mode kapcsoló. Az oldal egyes szekciói feketék, ezek dramaturgiai eszközök. A brand színek változatlanul működnek bennük.
              </p>
            </div>
          </div>

          <div className={`${styles.darkSample} section--dark`}>
            <p className="text-label" style={{ marginBottom: "var(--space-md)" }}>Példa</p>
            <p className="text-statement" style={{ marginBottom: "var(--space-lg)" }}>
              Felejtsd el az átlagost.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
              <a href="#" className={`${styles.swapButton} ${styles.swapButtonDark}`}>
                <CtaSwap defaultLabel="Kezdjük el." hoverLabel="Beszéljünk!" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
