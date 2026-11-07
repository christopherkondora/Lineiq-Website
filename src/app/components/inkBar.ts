import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Sizes a red bar to the letters of the word it covers: from the top of the
 * word's tallest glyph (the dots of Ü, the l of "ügyfelekkel") to the bottom of
 * its lowest (the tails of g and y), measured from the baseline.
 *
 * The line box is not used. Its height is the line-height and has nothing to do
 * with the letters, so a bar sized by it is too tall in one font size and too
 * short in another, and lies over the line below. This measures the real glyphs
 * (canvas text metrics) at the word's own font, so any word in any language
 * gets its own exact height.
 *
 * `word` is the element whose text is covered, `box` the positioned element
 * (position: relative) the bar is absolutely placed in. Sets `top` and `height`
 * on the bar; the bar's horizontal CSS is left alone.
 *
 * Returns what the caller needs to line other text up with the word:
 * `lineBaseline` is where the baseline sits inside a line box of height 1em.
 * Re-run on resize and once the fonts have loaded (see `fitBarToWord`).
 */
export function placeBarOnWord(word: HTMLElement, bar: HTMLElement, box: HTMLElement) {
  const canvas = document.createElement("canvas").getContext("2d");
  if (!canvas) return null;
  const style = getComputedStyle(word);
  const size = parseFloat(style.fontSize);
  const REF = 200;
  canvas.font = `${style.fontWeight} ${REF}px ${style.fontFamily}`;
  const m = canvas.measureText(word.textContent ?? "");
  const px = size / REF;
  const up = m.actualBoundingBoxAscent * px;
  const down = m.actualBoundingBoxDescent * px;

  // A zero-size inline box sits on the baseline, so its edge is the baseline.
  const marker = document.createElement("span");
  marker.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
  word.appendChild(marker);
  const baseline = marker.getBoundingClientRect().bottom;
  marker.remove();

  bar.style.top = `${baseline - up - box.getBoundingClientRect().top}px`;
  bar.style.bottom = "auto";
  bar.style.height = `${up + down}px`;

  const lineBaseline =
    (size - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent) * px) / 2 +
    m.fontBoundingBoxAscent * px;
  return { up, down, lineBaseline };
}

/**
 * Places the bar now, again when the fonts have loaded, and again on resize
 * (the type is fluid, so the letters change size). Returns the cleanup.
 */
export function fitBarToWord(
  word: HTMLElement,
  bar: HTMLElement,
  box: HTMLElement,
  onPlaced?: (placed: NonNullable<ReturnType<typeof placeBarOnWord>>) => void
) {
  const place = () => {
    const placed = placeBarOnWord(word, bar, box);
    if (placed) onPlaced?.(placed);
  };
  place();
  let alive = true;
  document.fonts.ready.then(() => {
    if (!alive) return;
    place();
    ScrollTrigger.refresh();
  });
  window.addEventListener("resize", place);
  return () => {
    alive = false;
    window.removeEventListener("resize", place);
  };
}
