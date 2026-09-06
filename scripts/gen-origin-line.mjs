// Generates the `d` for the line behind the About origin prose.
//
// Hand-authoring it produced a shape that matched the sketch and did not flow:
// the loop met its tangent lines at the bottom in a visible pinch, because
// tangent continuity is not curvature continuity. This builds the curve as one
// parametric function instead, so there is nothing to join.
//
// The loop is a trochoid: a point advancing along a carrier line while a phase
// term walks it once around a circle of radius R. When the phase is 0 or 2*PI
// the offsets vanish and the curve is exactly the carrier, and because the
// phase ramps on a smootherstep — zero first AND second derivative at both ends
// — it enters and leaves the loop with no curvature step at all. The crossing
// is not drawn, it falls out: the phase runs faster than the carrier advances,
// so the pen briefly travels backwards and its own path is in the way.
//
//   node scripts/gen-origin-line.mjs
//
// Paste the printed d into ORIGIN_LINE in components/AboutOrigin.tsx.

const W = 1440;   // viewBox width, the desktop section width
const H = 805;    // viewBox height, the section height with its deeper bottom pad

// The copy column, which the line may not touch. Measured, not guessed.
const COPY = { l: 48, r: 668, t: 128, b: 485 };

const X0 = -60, X1 = 1500;        // bleeds past both edges
const Y_IN = 640;                 // where it enters at the left, low under the copy
const Y_FLAT = 712;               // the sag it settles into
const Y_OUT = 90;                 // where it leaves, top right

const RISE = [0.7, 1.0];          // when the carrier climbs out
const SAG = [0.0, 0.3];           // when it settles into the flat run
const LOOP = [0.52, 0.8];         // when the phase walks its 2*PI
const R = 190;                    // loop radius

// smootherstep: 0 and 1 first and second derivatives at both ends
const ss = (u, a, b) => {
  const t = Math.min(1, Math.max(0, (u - a) / (b - a)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const carrier = (u) => ({
  x: X0 + (X1 - X0) * u,
  y: Y_IN + (Y_FLAT - Y_IN) * ss(u, ...SAG) + (Y_OUT - Y_FLAT) * ss(u, ...RISE),
});

const point = (u) => {
  const c = carrier(u);
  const phi = 2 * Math.PI * ss(u, ...LOOP);
  return { x: c.x + R * Math.sin(phi), y: c.y - R * (1 - Math.cos(phi)) };
};

// Dense sample, then resample at equal arc length so the emitted control points
// are evenly spaced and the fit stays stable through the loop.
const N = 8000;
const dense = [];
for (let i = 0; i <= N; i++) dense.push(point(i / N));
const cum = [0];
for (let i = 1; i <= N; i++) {
  cum.push(cum[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y));
}
const total = cum[N];

const SEGMENTS = 70;
const pts = [];
let j = 0;
for (let k = 0; k <= SEGMENTS; k++) {
  const target = (k / SEGMENTS) * total;
  while (j < N && cum[j + 1] < target) j++;
  const span = cum[j + 1] - cum[j] || 1;
  const f = (target - cum[j]) / span;
  pts.push({
    x: dense[j].x + (dense[j + 1].x - dense[j].x) * f,
    y: dense[j].y + (dense[j + 1].y - dense[j].y) * f,
  });
}

// Catmull-Rom through the samples, expressed as cubics.
const r2 = (n) => Math.round(n * 10) / 10;
let d = `M ${r2(pts[0].x)} ${r2(pts[0].y)}`;
for (let i = 0; i < pts.length - 1; i++) {
  const p0 = pts[i - 1] ?? pts[i];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[i + 2] ?? pts[i + 1];
  const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
  const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
  d += ` C ${r2(c1.x)} ${r2(c1.y)}, ${r2(c2.x)} ${r2(c2.y)}, ${r2(p2.x)} ${r2(p2.y)}`;
}

// --- checks ---------------------------------------------------------------
const distToCopy = (p) => {
  const dx = Math.max(COPY.l - p.x, p.x - COPY.r, 0);
  const dy = Math.max(COPY.t - p.y, p.y - COPY.b, 0);
  return dx === 0 && dy === 0 ? -1 : Math.hypot(dx, dy);
};
let minClear = Infinity, at = null;
for (const p of dense) {
  const dd = distToCopy(p);
  if (dd < minClear) { minClear = dd; at = p; }
}
const xs = dense.map((p) => p.x), ys = dense.map((p) => p.y);

// deviation of the emitted cubics from the true curve
const bez = (a, b, c, e, t) => {
  const m = 1 - t;
  return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * e;
};
let maxDev = 0;
for (let i = 0; i < pts.length - 1; i++) {
  const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? pts[i + 1];
  const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
  const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
  for (let t = 0; t <= 1; t += 0.05) {
    const bx = bez(p1.x, c1.x, c2.x, p2.x, t), by = bez(p1.y, c1.y, c2.y, p2.y, t);
    let best = Infinity;
    for (const q of dense) {
      const dd = (q.x - bx) ** 2 + (q.y - by) ** 2;
      if (dd < best) best = dd;
    }
    maxDev = Math.max(maxDev, Math.sqrt(best));
  }
}

console.log(d);
console.log("\n--- checks ---");
console.log("viewBox           ", `0 0 ${W} ${H}`);
console.log("bbox              ", `x ${r2(Math.min(...xs))}..${r2(Math.max(...xs))}  y ${r2(Math.min(...ys))}..${r2(Math.max(...ys))}`);
console.log("clearance to copy ", minClear === -1 ? "CROSSES THE COPY" : `${Math.round(minClear)}px at (${Math.round(at.x)}, ${Math.round(at.y)})`);
console.log("path length       ", Math.round(total));
console.log("loop share        ", `${Math.round(((cum[Math.round(N * LOOP[1])] - cum[Math.round(N * LOOP[0])]) / total) * 100)}% of the draw`);
console.log("fit deviation     ", `${maxDev.toFixed(2)}px max (${SEGMENTS} segments)`);
console.log("d length          ", d.length, "chars");
