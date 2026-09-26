// The red line on /contact: built from measurements, not authored.
//
// The origin line on /about is a generated curve living in a stretched viewBox
// (see scripts/gen-origin-line.mjs). That works there because the line only has
// to miss the copy. This one has to LAND on things — the underline of every
// field and the baseline of the submit control — and those positions move with
// the font metrics, the viewport width and the length of the heading's wrap. So
// the path is assembled at runtime from the fields' own rects and rebuilt on
// resize.
//
// On a wide screen the shape is deliberately two-part, and the split is the
// page's argument in geometry: a loose curve sweeps in from the left edge over
// the statement (the Artist), then turns and runs as a straight spine down the
// form (the Architect). On a phone the sweep has nowhere to happen and the
// spine is the whole line. One path either way, one stroke-dashoffset, no
// camera.

export interface Pt {
  x: number;
  y: number;
}

/** The corner radius where the sweep turns into the spine, and the spine into
 *  the stub under the submit. Small enough to read as a turn, not a loop. */
const R = 20;

/** How far above the first field the sweep arrives, so the corner has room to
 *  happen before the first node. */
const APPROACH = 44;

export interface LinePlan {
  d: string;
  /** One point per node, in order: each field, then the end of the stub. */
  nodes: Pt[];
}

/**
 * Assemble the path.
 *
 * @param entry   where the line crosses the left edge, or null for a phone,
 *                where it comes down the page's left margin from the top
 * @param spineX  the vertical run's x, just left of the field stack
 * @param fieldYs the underline y of each field, top to bottom
 * @param sendY   the baseline the stub runs along, under the submit control
 * @param stubX   where the stub stops
 */
export function buildContactLine(
  entry: Pt | null,
  spineX: number,
  fieldYs: number[],
  sendY: number,
  stubX: number
): LinePlan {
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const segments: string[] = [];

  if (entry) {
    const yTop = fieldYs[0] - APPROACH;
    const turnX = spineX - R;
    const dx = turnX - entry.x;

    // Both control points shape one calm S: the first sags a little out of the
    // edge so the line does not read as a ruled rule, the second shares the
    // endpoint's y so the curve arrives at the corner exactly horizontal. Any
    // other value there puts a kink in the turn.
    const c1 = { x: entry.x + dx * 0.4, y: entry.y + 28 };
    const c2 = { x: entry.x + dx * 0.78, y: yTop };

    segments.push(
      `M ${r1(entry.x)} ${r1(entry.y)}`,
      `C ${r1(c1.x)} ${r1(c1.y)}, ${r1(c2.x)} ${r1(c2.y)}, ${r1(turnX)} ${r1(yTop)}`,
      `Q ${r1(spineX)} ${r1(yTop)}, ${r1(spineX)} ${r1(yTop + R)}`
    );
  } else {
    // The phone has no second column for the line to cross, and a hook from the
    // left edge into a 20px margin is a kink, not a gesture. The line comes
    // straight down the page's margin from the top instead, past the statement
    // and into the form: one rule the whole length of the page.
    segments.push(`M ${r1(spineX)} 0`);
  }

  segments.push(
    // The spine is one straight run. The field nodes are points on it, not
    // vertices: nothing about the path changes as the line passes a field.
    `L ${r1(spineX)} ${r1(sendY - R)}`,
    `Q ${r1(spineX)} ${r1(sendY)}, ${r1(spineX + R)} ${r1(sendY)}`,
    `L ${r1(stubX)} ${r1(sendY)}`
  );

  const d = segments.join(" ");

  const nodes: Pt[] = fieldYs.map((y) => ({ x: spineX, y }));
  nodes.push({ x: stubX, y: sendY });

  return { d, nodes };
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
