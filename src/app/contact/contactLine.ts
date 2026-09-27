// The red line on /contact: built from measurements, not authored.
//
// The origin line on /about is a generated curve living in a stretched viewBox
// (see scripts/gen-origin-line.mjs). That works there because the line only has
// to miss the copy. This one has to LAND on things — one node per step of the
// flow, and the baseline of the submit control — and those positions move with
// the font metrics, the viewport width and the length of the heading's wrap. So
// the path is assembled at runtime from the steps' own rects and rebuilt on
// resize.
//
// What changed on 2026-09-26 (PRD: [[docs/website/2026-09-26-contact-qualify-flow]]):
// the line no longer runs straight down a column. The five steps are staggered
// by four unequal indents and the line winds between them, because a line
// through a flush column is a vertical rule and a camera following a vertical
// rule is a scroll. The indents live in the CSS (`--stagger-base` times a
// per-step ratio); this file only ever sees the measured result.

export interface Pt {
  x: number;
  y: number;
}

/** The corner radius where the spine turns into the stub under the submit.
 *  Small enough to read as a turn, not a loop. */
const R = 20;

/** How far above the first node the line starts, so the entry has room to be a
 *  gesture rather than a tick. */
const APPROACH = 150;

/** How far to the right of the first node the entry begins. The entry is the
 *  first thing drawn and the first thing the camera will follow, so it leans in
 *  from the side the content is on rather than dropping in vertically. */
const ENTRY_DX = 54;

/** How far the curve is allowed to swing past the x of the two nodes it runs
 *  between. Zero would be provably clean and would flatten every turn into a
 *  corner; this keeps the round turn at the extremes and caps how far the line
 *  can lean into the 30px gap it keeps from the content. */
const OVERSHOOT = 8;

/** Catmull-Rom tension. Full (1) overshoots noticeably on a path whose vertical
 *  gaps are three times its lateral ones. */
const TENSION = 0.6;

const r1 = (n: number) => Math.round(n * 10) / 10;

function clamp(n: number, lo: number, hi: number) {
  return n < lo ? lo : n > hi ? hi : n;
}

/**
 * A smooth curve through every point, as cubic Béziers.
 *
 * Catmull-Rom, converted segment by segment. The control points' x is clamped
 * to the span of the segment's own endpoints plus a small margin: a Bézier
 * stays inside the convex hull of its control points, so this is what
 * guarantees the line cannot wander right and cross a label on its way between
 * two steps. Nothing clamps y, which has nowhere unwanted to go.
 */
function spline(pts: Pt[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];

    const lo = Math.min(p1.x, p2.x) - OVERSHOOT;
    const hi = Math.max(p1.x, p2.x) + OVERSHOOT;

    const c1 = {
      x: clamp(p1.x + ((p2.x - p0.x) / 6) * TENSION, lo, hi),
      y: p1.y + ((p2.y - p0.y) / 6) * TENSION,
    };
    const c2 = {
      x: clamp(p2.x - ((p3.x - p1.x) / 6) * TENSION, lo, hi),
      y: p2.y - ((p3.y - p1.y) / 6) * TENSION,
    };

    out.push(
      `C ${r1(c1.x)} ${r1(c1.y)}, ${r1(c2.x)} ${r1(c2.y)}, ${r1(p2.x)} ${r1(p2.y)}`
    );
  }
  return out;
}

export interface LinePlan {
  d: string;
  /** One point per node the head can rest on, in order: the five steps, then
   *  the end of the stub under Send. */
  nodes: Pt[];
}

/**
 * Assemble the path.
 *
 * @param steps    one point per step, in order, at the step's left edge
 * @param send     where the line arrives beside the submit control
 * @param stubY    the baseline the stub runs along, under the submit control
 * @param stubX    where the stub stops
 * @param winding  false on a phone: the line comes down the page's own left
 *                 margin from the top, past the statement, as one straight rule
 */
export function buildContactLine(
  steps: Pt[],
  send: Pt,
  stubY: number,
  stubX: number,
  winding: boolean
): LinePlan {
  // The corner is a real point on the curve, so the spline arrives at the turn
  // already travelling straight down and the Q below cannot kink.
  const corner: Pt = { x: send.x, y: stubY - R };

  const through: Pt[] = winding
    ? [
        { x: steps[0].x + ENTRY_DX, y: steps[0].y - APPROACH },
        ...steps,
        send,
        corner,
      ]
    : // The phone has no second column for the line to cross, and a hook into a
      // 20px margin is a kink, not a gesture. The line comes straight down the
      // page's margin from the top instead, past the statement and into the
      // flow: one rule the whole length of the page.
      [{ x: steps[0].x, y: 0 }, ...steps, send, corner];

  const segments = [
    `M ${r1(through[0].x)} ${r1(through[0].y)}`,
    ...spline(through),
    `Q ${r1(send.x)} ${r1(stubY)}, ${r1(send.x + R)} ${r1(stubY)}`,
    `L ${r1(stubX)} ${r1(stubY)}`,
  ];

  // The send node is a waypoint, not a stop: once the four required steps are
  // answered the head runs all the way to the end of the stub, which is what
  // makes Send live. The optional fifth step is passed over, which is correct —
  // it is the one step that never has to be answered.
  const nodes: Pt[] = [...steps, { x: stubX, y: stubY }];

  return { d: segments.join(" "), nodes };
}

export interface NodeLengths {
  /** The path's own length, in user units. */
  total: number;
  /** How far along the path each node sits, same units. */
  at: number[];
}

/**
 * How far along the path each node sits.
 *
 * In real path units, not the normalised 0..1 of `pathLength`. The first build
 * used `pathLength="1"` so the hidden state could live in CSS as
 * `stroke-dashoffset: 1`, the way the /about origin line does, and it rendered
 * the line complete at every offset: the normalisation reaches
 * `getTotalLength()` but not the dash, so a dash of one authored unit was one
 * user unit of a 1442-unit path and the pattern never repeated visibly. Real
 * lengths cost nothing and behave.
 *
 * Measured off the browser's own path math rather than derived from the
 * segment lengths above, so the two can never drift apart when the shape is
 * edited. The sample count buys about a pixel of resolution on a path of this
 * size, which is finer than the stroke.
 */
export function measureNodeLengths(
  path: SVGPathElement,
  nodes: Pt[]
): NodeLengths {
  const total = path.getTotalLength();
  if (!total) return { total: 0, at: nodes.map(() => 0) };

  const SAMPLES = 1200;
  const pts: Pt[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = path.getPointAtLength((i / SAMPLES) * total);
    pts.push({ x: p.x, y: p.y });
  }

  const at = nodes.map((node, ni) => {
    // The last node is the path's own end. Saying so is exact and skips a
    // search that rounding could otherwise land one sample short of.
    if (ni === nodes.length - 1) return total;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i <= SAMPLES; i++) {
      const dxx = pts[i].x - node.x;
      const dyy = pts[i].y - node.y;
      const dist = dxx * dxx + dyy * dyy;
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    }
    return (best / SAMPLES) * total;
  });

  return { total, at };
}
