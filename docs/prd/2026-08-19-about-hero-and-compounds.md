---
type: prd
status: in-progress
created: 2026-08-19
updated: 2026-08-19
---

# /about: hero rework and the compounds section

Scope: the first third of `/about` (hero, origin), plus one new section
extracted from the origin's pull-quote. Sections from `AboutBeliefs` down are
touched only to delete their `◆` labels.

## Why

The hero opened with a signpost label, a statement set at paragraph leading, a
decorative red rule that did not reach either edge, and a positioning sentence
that restated the heading. Four elements, none load-bearing. The origin section
set ~90 words of running prose in Fraunces at display scale, which broke the
page's rhythm. The one belief the studio stakes itself on was buried at the
bottom of that section as a pull-quote.

## Goals

1. The hero is a single statement on full-viewport white. Nothing else.
2. The origin reads as prose, in the sans face, at a lede scale.
3. The Ism gets a full viewport and a scroll mechanic that performs its claim.
4. Section signposting (`◆` labels) is gone page-wide.

## Non-goals

- `AboutFounders`, `AboutMentors`, `BookshelfSection`, `AboutClose`, `Footer`
  beyond label deletion.
- Copy rewrites. Every sentence that survives, survives verbatim.
- The homepage. `--leading-tight` and the other shared tokens are not touched.

---

## 1. AboutHero

### Composition

- Delete the `◆ The studio` label.
- Delete the lede paragraph. The positioning line survives in
  `metadata.description` (`about/page.tsx`).
- Delete the red SVG rule: markup, `.rule` CSS, and the path-draw tween. The
  line gesture already lives on the homepage (`Hero.tsx` `.ambientLine`); a
  static one-shot draw here was a weaker echo of it.
- `min-height: 92vh` to `100vh`. With the label and lede gone the section landed
  within a few px of 92vh, making it indeterminate whether `AboutOrigin`'s black
  bled into the fold.

### Typography

- `line-height: 0.95`, applied **locally to `.heading`**. Not to
  `--leading-tight`: that token also drives `.text-statement` and
  `.text-signature`, so editing it would reflow the homepage and every statement
  section.
- `.headLine` (the `overflow: hidden` animation mask) gains `padding-bottom`
  equal to the descender depth, cancelled by an equal negative `margin-bottom`.
  Without it, tighter leading clips the tail of the `g` in "building."
- Remove `max-width: 16ch` from `.heading`. Line breaks are hardcoded in
  `HEAD_LINES`, so the cap only risks an unintended internal wrap.

### Red hyphen

`HEAD_LINES` becomes structured markup so the hyphen in "short-termism" can be
set in `--color-red`. The hyphen is a line, and it sits inside the word for the
thing the studio exists to end. Safe for the animation: the tween targets
`[data-hero-line] > span` (direct children only).

### Motion

- Three of four tweens deleted (label, lede, rule-draw).
- Line tween: `duration: 1.1`, `stagger: 0.14`, start `0.1` (was `0.2`, which was
  dead time waiting on a now-deleted element).
- `yPercent: 115` to `135`: the padded mask is taller, so 115 no longer hides the
  line at rest.
- `useEffect` to SSR-guarded `useLayoutEffect`. The animation currently runs
  after paint, so the heading paints fully formed and then snaps down. Four
  moving elements camouflaged it; one will not. The homepage's `data-enter` gate
  is deliberately **not** replicated: it exists to coordinate with the preloader
  and needs an inline script plus a failsafe to avoid permanently invisible text.

## 2. AboutOrigin

- Prose moves from Fraunces to Wix Madefor Display (`--font-body`).
- Editorial lede scale, not body scale: `clamp(1.15rem, 1.6vw, 1.45rem)`,
  weight `400`, leading `~1.6`, `letter-spacing: normal`.
- Drop `font-variation-settings: "opsz" 75`, a Fraunces-only axis.
- `.copy` max-width `720px` to `620px` (~62ch). The 720px value existed because
  Fraunces' `ch` unit was too narrow to cap with; that reason dies with Fraunces.
- Weight 500 to 400: white on black gains optical weight, and 500 in Wix reads
  near-bold.
- Section stays dark, and shares its black with the new section below it with no
  seam. Continuous black is what makes the pin invisible.
- The grid dissolves with the label. `.copy` aligns to the container's left edge,
  the same vertical line as the hero heading.
- The section runs **untitled**. Hero, Origin and compounds become one continuous
  piece of speech with no chapter headings; titled sections start at
  `AboutBeliefs`.
- The word-wave scroll animation is retained.

## 3. AboutCompounds (new)

Sits between `AboutOrigin` and `AboutBeliefs`. `section section--dark`.

### At rest

Two sentences, nothing else:

> Most marketing is a tax.
> Brand is the only thing that compounds.

Set in the existing `.text-statement` token (`clamp(2.5rem, 7vw, 4.5rem)`,
`opsz 125`), white.

The red rule is dropped: its job was separating the Ism from surrounding prose,
and there is no surrounding prose now. The caption "The one belief we stake the
studio on" is dropped because the mechanic makes the point the caption was
making.

### Mechanic

One continuous scrub, not sequential beats:

- Every word except `compounds` fades out.
- `compounds` simultaneously travels to horizontal centre, travels upward, and
  grows.
- All three resolve together: viewport width is reached at ~30% of the word's
  height past the top edge.
- The pin releases there. No exit animation, because the word is already moving
  upward, so there is no velocity discontinuity at the handoff to page scroll.

Horizontal centring is required: `compounds` is the last word of its sentence and
sits right of centre, so scaling in place would push it off the right edge long
before it reached full width.

### Crispness

The word renders at its **final** size and scrubs from `scale(~0.15)` to
`scale(1)`. Scaling text up blurs it: the browser rasterises once at layout size
and the GPU stretches the bitmap (Safari reliably; `will-change` locks the
layer). Scaling down is crisp at every step. A second, absolutely positioned copy
sits over the inline word with an invisible swap at scrub start; the inline word
holds its space at `opacity: 0` so nothing reflows. This also makes `opsz`
correct for free.

### Three modes

Mirrors `Work.tsx`: initial state `"static"` so SSR and first paint agree, mode
resolved after hydration, both media queries listened to.

| Mode | Behaviour |
|---|---|
| `>=768px` | Pinned, ~150vh budget, ~35% fade / ~65% growth |
| `<768px` | **No pin.** Normal 100vh block; scrub drives scale only, page scroll supplies the upward travel |
| reduced motion | Static. Both sentences, no growth, no pin |

Mobile drops the pin deliberately: iOS Safari resizes the viewport as its address
bar collapses, and a pinned element measured against a changing viewport height
jumps. No pin, no failure mode. The effect survives because it is not
width-dependent, and ordinary scroll already provides the upward travel.

## 4. Labels

All six `◆` labels deleted. In `AboutBeliefs`, `AboutFounders`, `AboutMentors`
and `AboutRefusals` this is lossless: each `<h2>` directly beneath already says
what the label said.

| Label | `<h2>` beneath it |
|---|---|
| ◆ What we believe | Seven convictions, and the work that follows from them. |
| ◆ The two of us | Two founders, one voice. |
| ◆ Whose thinking we run on | Those who came before us. |
| ◆ What we say no to | Refusal is a service. |

Surviving: `.limitationLabel` in `AboutRefusals` ("And one thing we will not
dress up"), a caption on specific content rather than a section signpost.
`.ismSource` dies with the Ism.

## 5. Rejected

| Option | Why not |
|---|---|
| Move the hero lede into `AboutOrigin` | Third-person positioning copy would blunt the origin's first-person opening |
| Shrink the hero so Origin's black peeks in as a scroll cue | Full white viewport suits the site's existing whitespace |
| Full-bleed 1px red rule in the hero | The line already lives on the homepage; here it was decoration |
| Red period in "building." | The hyphen is the better mark: it is a line, and it sits inside the word being argued against |
| Red `compounds` | Telegraphs the trick, competes with the scale, and red on black is 4.0:1 against white's 21:1, so the word would get dimmer as it grew |
| Word pre-centred at rest | Telegraphs the trick; the sentence must look ordinary first |
| Animating `font-size` instead of `scale` | Layout on every scroll frame |
| Hold beat at full width | Self-solving: the word stays at full width for a full viewport of scroll after release |
| Static mobile fallback | Mobile is the majority of traffic; they would get a plain quote instead of the page's centrepiece |

## 6. Changed during implementation

Four things the plan got wrong, found by looking at the built page.

**The growth ploughed through the sentence.** With both the fade and the growth
starting linearly at 0, the word was already ~18% larger and drifting left while
"thing that" was only a third faded, so it overlapped the words it was
replacing. Fixed with `ease: "power2.in"` on the growth, which holds it almost
still until the sentence has cleared and then accelerates, and `FADE_SHARE` from
0.35 to 0.28. Still one continuous tween across the whole range, so the mechanic
is unchanged; the exit now reads as a take-off rather than a constant crawl.

**The word was sized against the scrollbar.** `window.innerWidth` counts the
scrollbar, the section does not: 1440 against 1425, so the word overflowed ~7px
each side exactly when it landed. Now measured with
`document.documentElement.clientWidth`.

**Unpinned, the payoff shared the frame with the next section.** In flow mode the
section is exactly one viewport, so any scroll at all reveals `AboutBeliefs`, and
the word reached full width with white filling the lower half of the screen.
Fixed with `padding-bottom: 55vh` on the section below 767px: black runway that
outlasts the growth. Zeroed under reduced motion, which has no growth to make
room for.

**The hero sat ~32px low.** `.hero` still carried the asymmetric navbar-clearance
padding (168 top / 128 bottom) from when the content was top-anchored under a
label. Centred, that only pushed the heading down. Now symmetric `space-3xl`,
which clears the navbar on its own.

Also worth recording: removing `max-width: 16ch` from `.heading` was not
cosmetic. At the current size "brands worth building." measures ~1310px against a
~1264px cap, so the line would have wrapped inside its own mask.

## 7. Verified

- Production build, `tsc --noEmit` and eslint all clean.
- Desktop pin: `startScale` 0.2161 measured against 72px inline over a 333px
  final size, which is exact. Word centre lands on viewport centre. Letterforms
  stay sharp at every step, confirming the scale-down approach.
- Mobile flow: word reaches exactly 390px at `left: 0` on a 390px viewport.
- Reduced motion: display copy `display: none`, section height 900 with no pin
  spacer, inline word visible. No page errors in any mode.

## 8. Tuned in the browser

- Exit crop, starting at 30%. Likely goes further, since legibility at peak is
  not a constraint: the reader has already read the word.
- Pin budget (~150vh) and the 35/65 split.
- Descender padding on `.headLine`.
- Mobile hero line breaks: "short-termism in the" at 3rem on a ~390px screen
  wraps inside its mask. Pre-existing; the mask still works but the stagger reads
  differently. Check on device.
