// Közös hullámmotor — a hero ambient vonalai ÉS a betöltési zaj-fázis
// egyetlen paraméterkészletből épülnek. Minden komponensnek két állapota van:
// volatile (V — a betöltés nyugtalan zaja) és calm (C — a hero ambient
// lélegzése). A p érték (0 → volatile, 1 → calm) folytonosan keveri a kettőt,
// így a megnyugvás matematikai garancia: a vonal egyetlen frame-en sem ugrik,
// a preloader varrat nélkül válik a hero hátterévé.
//
// A fázis komponensenként AKKUMULÁLÓDIK (phi += speed * dt), nem t * speed
// formában számolódik — különben a sebesség tweenelése a szinusz argumentumát
// ugráltatná, és a lassulás pillanatában a hullám visszafelé rántana.

export type WaveComp = {
  ampC: number; // calm amplitúdó (a hero ismert értékei)
  ampV: number; // volatile amplitúdó
  kC: number; // calm hullámszám
  kV: number; // volatile hullámszám (rövidebb hullámhossz = idegesebb)
  speedC: number; // calm fázissebesség
  speedV: number; // volatile fázissebesség
  phase: number; // kezdőfázis
};

export type WaveLine = { baseline: number; comps: WaveComp[] };

const TAU = Math.PI * 2;
const WAVE_X0 = -60;
const WAVE_X1 = 1500;
const WAVE_STEP = 60;

// Desktop. A calm értékek a hero eddigi ambient paraméterei, változatlanul.
// A volatile oldalon a két alap-komponens felhangosítva, plusz két csak-zaj
// komponens (ampC: 0 — a megnyugvással kihalnak): egy rövidhullámú ideges
// fodrozódás és egy még rövidebb tremor. A két vonal volatile sebességei
// ellentétes előjelűek, hogy kaotikusan keresztezzék egymást.
export const HERO_LINE_A: WaveLine = {
  baseline: 340,
  comps: [
    { ampC: 30, ampV: 52, kC: TAU / 980, kV: TAU / 660, speedC: 0.32, speedV: 2.4, phase: 0 },
    { ampC: 9, ampV: 30, kC: TAU / 560, kV: TAU / 230, speedC: -0.5, speedV: -3.6, phase: 1.1 },
    { ampC: 0, ampV: 16, kC: TAU / 300, kV: TAU / 110, speedC: 0.2, speedV: 5.6, phase: 2.3 },
    { ampC: 0, ampV: 7, kC: TAU / 120, kV: TAU / 48, speedC: -0.3, speedV: -8.5, phase: 0.7 },
  ],
};

export const HERO_LINE_B: WaveLine = {
  baseline: 366,
  comps: [
    { ampC: 27, ampV: 48, kC: TAU / 1080, kV: TAU / 740, speedC: 0.26, speedV: -2.1, phase: 1.8 },
    { ampC: 8, ampV: 26, kC: TAU / 600, kV: TAU / 260, speedC: 0.44, speedV: 3.1, phase: 0.4 },
    { ampC: 0, ampV: 14, kC: TAU / 320, kV: TAU / 95, speedC: -0.25, speedV: -6.2, phase: 4.1 },
    { ampC: 0, ampV: 6, kC: TAU / 130, kV: TAU / 52, speedC: 0.35, speedV: 7.4, phase: 2.9 },
  ],
};

// Mobil: a viewBox ~390px-re nyúlik (preserveAspectRatio "none"), ezért a
// hullámhosszak ~3x nyújtva és az amplitúdók szelídítve — a calm értékek a
// hero eddigi mobil paraméterei, a volatile ugyanabban az arányban nyugtatva.
export const HERO_LINE_A_MOBILE: WaveLine = {
  baseline: 340,
  comps: [
    { ampC: 20, ampV: 38, kC: TAU / 2900, kV: TAU / 1700, speedC: 0.18, speedV: 2.0, phase: 0 },
    { ampC: 6, ampV: 20, kC: TAU / 1680, kV: TAU / 620, speedC: -0.28, speedV: -3.0, phase: 1.1 },
    { ampC: 0, ampV: 11, kC: TAU / 800, kV: TAU / 300, speedC: 0.15, speedV: 4.6, phase: 2.3 },
    { ampC: 0, ampV: 5, kC: TAU / 350, kV: TAU / 140, speedC: -0.2, speedV: -7.0, phase: 0.7 },
  ],
};

export const HERO_LINE_B_MOBILE: WaveLine = {
  baseline: 366,
  comps: [
    { ampC: 18, ampV: 34, kC: TAU / 3200, kV: TAU / 1900, speedC: 0.15, speedV: -1.8, phase: 1.8 },
    { ampC: 5, ampV: 17, kC: TAU / 1800, kV: TAU / 680, speedC: 0.25, speedV: 2.6, phase: 0.4 },
    { ampC: 0, ampV: 9, kC: TAU / 850, kV: TAU / 320, speedC: -0.2, speedV: -5.4, phase: 4.1 },
    { ampC: 0, ampV: 4, kC: TAU / 380, kV: TAU / 150, speedC: 0.3, speedV: 6.6, phase: 2.9 },
  ],
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Komponensenkénti akkumulált fázisok kezdőértéke.
export function initPhases(line: WaveLine): number[] {
  return line.comps.map((c) => c.phase);
}

// Egy frame: lépteti a fázisokat az aktuális (kevert) sebességgel, majd
// a kevert amplitúdó/hullámszám értékekkel megépíti a path-t.
// Catmull-Rom spline a mintapontokon át (kubik bezierként renderelve),
// hogy a vonal töréspont nélkül folyjon.
export function stepWavePath(
  line: WaveLine,
  phases: number[],
  dt: number,
  p: number
): string {
  const n = line.comps.length;
  const amps = new Array<number>(n);
  const ks = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const c = line.comps[i];
    phases[i] += lerp(c.speedV, c.speedC, p) * dt;
    amps[i] = lerp(c.ampV, c.ampC, p);
    ks[i] = lerp(c.kV, c.kC, p);
  }

  const pts: number[] = [];
  for (let x = WAVE_X0; x <= WAVE_X1; x += WAVE_STEP) {
    let y = line.baseline;
    for (let i = 0; i < n; i++) {
      y += amps[i] * Math.sin(x * ks[i] + phases[i]);
    }
    pts.push(x, y);
  }

  const count = pts.length / 2;
  const px = (i: number) => pts[Math.max(0, Math.min(count - 1, i)) * 2];
  const py = (i: number) => pts[Math.max(0, Math.min(count - 1, i)) * 2 + 1];

  let d = `M${px(0).toFixed(1)} ${py(0).toFixed(2)}`;
  for (let i = 0; i < count - 1; i++) {
    const c1x = px(i) + (px(i + 1) - px(i - 1)) / 6;
    const c1y = py(i) + (py(i + 1) - py(i - 1)) / 6;
    const c2x = px(i + 1) - (px(i + 2) - px(i)) / 6;
    const c2y = py(i + 1) - (py(i + 2) - py(i)) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(2)} ${c2x.toFixed(1)} ${c2y.toFixed(
      2
    )} ${px(i + 1).toFixed(1)} ${py(i + 1).toFixed(2)}`;
  }
  return d;
}

// Statikus calm frame — SSR / first paint / reduced-motion.
export function staticWavePath(line: WaveLine): string {
  return stepWavePath(line, initPhases(line), 0, 1);
}
