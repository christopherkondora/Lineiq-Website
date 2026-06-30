import type { Metadata } from "next";
import styles from "./styleguide.module.css";
import CtaSwap from "../components/CtaSwap";

export const metadata: Metadata = {
  title: "Styleguide — LineiQ",
  description: "Living visual reference for the LineiQ design system.",
  robots: { index: false, follow: false },
};

type Color = { token: string; hex: string; name: string; note?: string };

const baseColors: Color[] = [
  { token: "--color-white", hex: "#FFFFFF", name: "White", note: "Base background" },
  { token: "--color-black", hex: "#000000", name: "Black", note: "Text, dark sections" },
  { token: "--color-red", hex: "#DA0303", name: "Red", note: "Brand voice, lines, reveal" },
];

const grayColors: Color[] = [
  { token: "--color-surface", hex: "#F4F4F4", name: "Surface", note: "Card background" },
  { token: "--color-border", hex: "#E0E0E0", name: "Border", note: "Divider lines" },
  { token: "--color-muted", hex: "#A0A0A0", name: "Muted text", note: "Secondary text" },
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
          <h1 className={styles.title}>Visual system</h1>
          <p className={styles.lead}>
            Living reference for the LineiQ website&apos;s design tokens, components and motion system. Every color, size and animation reads the actual CSS variables, so this page always shows the current state, not a copy.
          </p>
        </header>

        {/* ─── 01 Színek ──────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>01</span>
            <div>
              <h2 className={styles.sectionTitle}>Color system</h2>
              <p className={styles.sectionNote}>
                Red is the brand&apos;s voice and the only color alongside the black-and-white base. The grays are functional, not decorative.
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
              <h2 className={styles.sectionTitle}>Typographic roles</h2>
              <p className={styles.sectionNote}>
                Three fonts, three jobs. Fraunces for display, Wix Madefor for function, Kranky for the signature. Kranky for English words only, never for paragraphs.
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
              One package, not à la carte
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
              The LineiQ visual system rests on a balance of two forces, precision and personality. The architecture is geometric and controlled, while the brand&apos;s signature carries the mark of a human hand.
            </p>
          </div>

          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeLabel}>Nav</span>
              <span className={styles.typeToken}>.text-nav · Wix Madefor</span>
            </div>
            <div className={`${styles.typeSample} text-nav`}>Work · Services · About</div>
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
              <h2 className={styles.sectionTitle}>Size scale</h2>
              <p className={styles.sectionNote}>
                The full type scale set in Fraunces, so the character is visible at a glance. Fraunces&apos;s optical axis (opsz) grows with size: the large display size gets thin, high-contrast strokes, the small one stays sturdy and legible. For body text use Wix Madefor, with the same size scale.
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
                A seven-step scale from four pixels to 128 pixels. Between sections <code>--space-xl</code> and <code>--space-2xl</code> dominate; avoiding clutter is deliberate.
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
              <h2 className={styles.sectionTitle}>Corner system</h2>
              <p className={styles.sectionNote}>
                The components are geometric and sharp; the curve is carried by Fraunces and Kranky. The pill appears only on buttons and small low-contrast elements.
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
              <h2 className={styles.sectionTitle}>Buttons</h2>
              <p className={styles.sectionNote}>
                There is one button: the highlight-swap. A black strike covers the word, then brings up the secondary label letter by letter; on a dark background the strike is white and the hover text is black. Hover over it to see the motion.
              </p>
            </div>
          </div>

          <div className={styles.buttonStage}>
            <div className={styles.buttonRow}>
              <a href="#" className={styles.swapButton}>
                <CtaSwap defaultLabel="Let's talk?" hoverLabel="Let's go!" />
              </a>
            </div>

            <div className={`${styles.buttonRow} ${styles.buttonRowDark} section--dark`}>
              <a href="#" className={styles.swapButton}>
                <CtaSwap defaultLabel="Let's talk?" hoverLabel="Let's go!" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── 07 Motion ──────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>07</span>
            <div>
              <h2 className={styles.sectionTitle}>Motion</h2>
              <p className={styles.sectionNote}>
                Weight and calm, not speed. The slowest in-out is the brand&apos;s inhale, expo is the more pronounced entrance. We don&apos;t use fast movement here; the pace is the culture itself. Hover over a tile to see the curve.
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
              <h2 className={styles.sectionTitle}>Line system</h2>
              <p className={styles.sectionNote}>
                The line is a core brand element, but it rarely speaks. Only one type lives in a section, and only where the composition can bear it. Red is the only color, and the density is always low.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "var(--space-lg)", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div className={styles.lineSample}>
              <svg className={styles.ambientLine} viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 70 Q 100 30, 200 70 T 400 70" />
                <path d="M0 110 Q 100 70, 200 110 T 400 110" />
              </svg>
              <span className={styles.lineCaption}>Ambient — two waves out of phase</span>
            </div>

            <div className={styles.lineSample}>
              <div className={styles.narrativeLine}>
                <span />
              </div>
              <span className={styles.lineCaption}>Narrative — scroll-triggered, one-directional</span>
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
              <span className={styles.lineCaption}>Radial — radiating cluster, into the corner</span>
            </div>

            <div className={styles.lineSample}>
              <div className={styles.cascadeLines} aria-hidden="true">
                <span /><span /><span /><span /><span /><span /><span />
              </div>
              <span className={styles.lineCaption}>Cascade — stepped lines, undulating</span>
            </div>
          </div>
        </section>

        {/* ─── 09 Dark szekció ────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNumber}>09</span>
            <div>
              <h2 className={styles.sectionTitle}>Dark section</h2>
              <p className={styles.sectionNote}>
                There is no dark mode toggle. Some sections of the site are black; these are dramaturgical devices. The brand colors work unchanged within them.
              </p>
            </div>
          </div>

          <div className={`${styles.darkSample} section--dark`}>
            <p className="text-label" style={{ marginBottom: "var(--space-md)" }}>Example</p>
            <p className="text-statement" style={{ marginBottom: "var(--space-lg)" }}>
              Forget being ordinary.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
              <a href="#" className={`${styles.swapButton} ${styles.swapButtonDark}`}>
                <CtaSwap defaultLabel="Let's begin." hoverLabel="Let's talk!" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
