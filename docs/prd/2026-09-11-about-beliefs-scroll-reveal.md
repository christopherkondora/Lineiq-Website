---
type: prd
status: done
created: 2026-09-11
updated: 2026-09-11
---

# /about: the beliefs section as a scroll-revealed ledger

Scope: `AboutBeliefs` only. The section is rebuilt from a twelve-column spread of
four bespoke cell variants into a two-column layout with five uniform rows, one
of which is open at a time as the reader scrolls. Two copy lines change and the
placeholder photograph is deleted. `about/page.tsx` is touched for its metadata
description.

## Why

The section started as seven convictions each followed by a paragraph restating
it, which was slop. The rework earlier on 2026-09-11 fixed the *content* by
filing each conviction with what holding it costs, and that part worked: the
costs carry euro figures and unpaid days, so no competitor can paste them.

The *form* did not work. Four hand-tuned cell variants, a Kranky signature, an
explicit twelve-column placement map and a photograph holding the right edge
added up to a section performing its own importance. It went through several
versions and never settled, and the pull to delete the whole thing was really a
pull to stop fighting the layout.

The diagnosis that produced this document: the content is for the reader, the
styling was for us. So the content survives and the composition is replaced with
one that is uniform by default, where any difference between rows comes from the
sentences rather than from a variant class.

Reference for the mechanic: `wearedirect.co/agency`, section `04 / Our values`.
Ripped to `C:\Claude Code Projects\wearedirect.co`. What was taken and what was
rejected is in section 7.

## Goals

1. One row shape, five times. No variant classes.
2. The resting state scans as five claims; scrolling pays out the receipt for
   each one.
3. The section's height never changes, so no `ScrollTrigger.refresh()` fires
   during scroll.
4. No stock imagery anywhere in the section.

## Non-goals

- Every other section on `/about`. `AboutCompounds` above is untouched, and its
  pin is the main reason for the constant-height constraint in section 3.
- The Beliefs and Principles docs in the vault. Two stale lines are flagged in
  section 8 but are fixed there, not here.
- The LinkedIn / P7 question. Deliberately out of scope; see section 8.

---

## 1. Content

Five convictions, verbatim from `Beliefs.md` (locked v1), each with the cost
condensed from the matching House Rule's Cost of Holding line in
`Principles.md`.

| Conviction | Rule | Change |
|---|---|---|
| Compounding wins. | P1 Build the Compound | cost reworded |
| We would rather own a small world than rent a big market. | P3 Three Seats Only | unchanged |
| We compete with our last piece of work, not with anyone else. | P8 The Wow Bar | unchanged |
| Calm is the product. | **P6 Ship No Slop** | **re-sourced** |
| Win-win, or no deal. | P4 Earned Pay, No Refunds | unchanged |

**"We forgo" becomes "We turn down."** Forgo is correct English and the wrong
word for this site: Voice v2 is plain language with conviction, and
`Principles.md:40` already says it plainer ("we turn away the large, easy
market"). Nothing should ship that a founder would not say out loud on a call.

**"Calm is the product" is re-sourced from P7 to P6.** The P7 cost line names
YouTube and Instagram as channels the studio is absent from, which stopped being
true when those became the two chosen channels. Beyond being stale, it was the
weaker line: an absence is not checkable. P6's cost is:

> We publish less, and slower, than firms that mass-generate. We say no to easy
> volume.

That is checkable against the actual feed in four seconds, and it is truer to the
claim: calm is about pace, not about channel count. It also decouples the section
from the open LinkedIn question entirely.

**Five, not seven.** `Beliefs.md` locks seven public convictions. The two left
out are "We don't want to be rich. We want to be wealthy." and "Setbacks are
tuition." Both are aphorisms that would survive being pasted onto any studio
site, which is the definition this section exists to fail. Costs could be
manufactured for them (P12 would cover the second, loosely) but a cost that has
to be hunted for is not a cost being paid. The public doc holding seven while the
site shows five is not a contradiction: `Beliefs.md:22` says the Beliefs inspire
and the House Rules decide, and the site shows the subset where the two layers
touch.

The `cost` field stays required on the type, so a conviction without one still
cannot appear here.

## 2. Composition

Two columns, `5fr 7fr`.

**Left, sticky.** Section title and lead, nothing else. Sticky at
`top: var(--space-xl)` so the question stays on screen while the answers move.
This is the whole reason the layout is two-column rather than the previous
full-width header: the title is "What we believe, and what believing it costs
us", and the section reads better when that stays visible next to the bills.

**Right.** Five rows separated by 1px hairlines, plus a closing rule under the
last. Each row is a conviction over a cost slot. Nothing is interactive, so
nothing responds to a cursor; there are no numerals, no hover, no progress rail.
The section is a sequence, not a list, and any furniture announcing "list" is
what the first two versions got wrong.

**Type.** The conviction takes Fraunces (the Artist register), sized as the thing
being scanned: `clamp(1.35rem, 2.5vw, 2.25rem)`, `opsz 40`, `--tracking-tight`.
The cost takes Wix (the Architect register, the one with figures in it) at
`--text-lg` on `--leading-relaxed`. That register split is carried over from the
version this replaces; it was the one part of the old CSS worth keeping.

The photograph and its `picsum.photos` placeholder are deleted, along with
`.cellPhoto`, `.wallImage` and `.wallCaption`. `Principles.md` section 6 forbids
stock imagery on any surface, and a stock photograph illustrating the studio's
integrity, two screens above a promise to publish nothing embarrassing, was the
most damaging thing on the page. The A3 card in
`docs/print/house-rules-card.html` still exists and should still be printed for
the actual wall; if the photograph is wanted on the site later it belongs near
`AboutRefusals` or the founders, where a physical artifact reads as evidence
rather than as decoration for a claim.

## 3. Mechanic

One row open at a time. Opening pushes the rows below it down, in place.

### The collapse

The `0fr` to `1fr` grid-row trick, from the reference:

```css
.costOuter { display: grid; grid-template-rows: 0fr; transition: grid-template-rows; }
.cost      { overflow: hidden; min-height: 0; }
.costOuter.isOpen { grid-template-rows: 1fr; }
```

Animates to auto height with zero JS measurement of the tween itself.

### The constant-height container (the one real departure)

The reference lets the page grow and calls `lenis.resize()` plus
`ScrollTrigger.refresh(true)` after every transition. We cannot: `AboutCompounds`
pins a stage with `invalidateOnRefresh: true` directly above this section, and
`AboutFounders`, `AboutRefusals` and `BookshelfSection` all run scrubs below it.
`refresh(true)` recalculates every trigger on the page, so five row-opens per
pass would recompute a pin the reader has just scrolled out of, mid-scroll.

Because exactly one row is ever open, the section's height only ever varies by
one cost block. So that much slack is reserved once, on the rows container, as a
fixed pixel height:

```
height = (height with every row closed) + (tallest cost block)
```

Rows then expand inside it and push each other down exactly as in the reference,
while the container, the section and the page height never change. No refresh and
no resize fires during scroll. The slack, at most one line of cost, sits
invisibly at the bottom of the container.

Measured after `document.fonts.ready`, because measuring before the webfonts land
gives the wrong height. One `ScrollTrigger.refresh()` follows the measurement, at
mount, which is ordinary.

### The driver

A single `ScrollTrigger` on the rows container, `start: "top 72%"`,
`end: "bottom 65%"`, reading `self.progress` in `onUpdate` and mapping it to an
index across five equal bands.

Progress, not per-row geometry. The reference walks every block's
`getBoundingClientRect()` on every scroll frame, which works there but would be
unstable here: rows move when a row above them opens, so a rect-threshold test
can push a row past its own trigger point and oscillate. Container progress is
monotonic and, with the height pinned, completely stable.

Active index starts at `0` rather than "none open". The section carries
`id="beliefs"`, so it is an anchor target, and a reader landing directly on it
should not find five claims with nothing under them.

### The colour beat

Inactive convictions sit at `rgba(0, 0, 0, 0.3)`. Opening runs the reference's
two-step timeline: flash to `--color-red` for `0.05s`, then settle to full black
over `0.2s` on `power2.out`. Closing returns to the ghost over `0.25s`, faster
than the open, so the exit never fights the entrance.

Not the reference's 5% black: that is roughly 1.05:1 against white, which is an
accessibility failure, and at five rows rather than six there is less need to
suppress the set. 30% keeps all five readable as a group while leaving the active
row unmistakable. One accent, not the reference's six-colour cycle.

### Fallback

Default CSS is **open**: every row expanded, every conviction full black, height
`auto`. JS closes the rows on init by adding an `enhanced` class to the root, and
returns before doing so under `prefers-reduced-motion`. So both the no-JS case
and the reduced-motion case get the complete section, static and tall, with no
media query needed.

This matches the house pattern: every component on `/about` runs
`if (prefersReducedMotion) return;` and leaves its content in the final visible
state.

### Narrow

Below 900px the layout collapses to one column and the left cell stops being
sticky. The mechanic is unchanged; the reveal is the same on a phone.

## 4. Deleted

`cellLead`, `cellDense`, `cellSignature`, `cellColumn` and the `Variant` type;
`VARIANT_CLASS`; `signatureWord`, `.signature`, `.signatureWord` and
`restAfterWord()`; `lowerFirst()` and the "Because" connective, which only
existed for the one cell that read cost-first; `.cellPhoto`, `.wallImage`,
`.wallCaption`, `WALL_PHOTO`; the explicit twelve-column placement map; the
per-cell `ScrollTrigger` stagger, replaced by one trigger for the whole section.

The Kranky signature on "Calm" goes with the variants. It was the section's one
use of the signature face, and it existed because that conviction happened to be
short enough, which is a layout accident rather than a reason.

## 5. Also changed

`about/page.tsx` metadata description says "the seven beliefs we run on". With
five on the page, it becomes five.

## 6. Rejected

| Option | Why not |
|---|---|
| Cut the section entirely | It carries two of the four rungs on the persona's trust ladder (`Pillar-4-Persona.md`): proof of thinking, and evidence the provider stakes something. Deleting it would have removed a rung and added nothing |
| Cost visible at rest, conviction revealed | The costs are 15 to 20 word sentences; the resting list would not scan, and it hides the punchline behind the setup |
| A short figure always visible on each closed row | Only three of five costs carry a hard number (1,500 to 4,000 a month, three seats, 90 days). Inventing one for P8 and P6 is exactly the fabrication the persona is described as detecting |
| Rows accumulate instead of one-at-a-time | The section balloons, and the one-thing-at-a-time focus that makes the reference calm is lost |
| Reserve the cost's space and crossfade it in | Safer still, but the in-place push is the motion worth having, and the constant-height container makes it safe anyway |
| Pin and scrub the section | `AboutCompounds` already pins immediately above. Two consecutive pinned stages is where an About page starts feeling like a slideshow, which is the opposite of "Calm is the product" |
| Keep the photograph, ship the placeholder | Stock imagery, forbidden by `Principles.md` section 6, inside the section arguing the studio's convictions are costly |
| Keep the photograph, block on a real shoot | Makes shipping depend on a printer, A3 paper, a wall and a photographer, none of which exist today |
| Seven rows | See section 1 |
| A `01 /` caption on the section | The diamond signposts were deliberately deleted page-wide on 2026-08-19; re-introducing numbering here would reverse that for one section |

## 7. What was taken from the reference, and what was not

**Taken:** the ghost-to-solid colour shift on the active row; one row open at a
time driven by scroll position; hairline separators with no numerals and no
progress rail; the `0fr`/`1fr` collapse; close-faster-than-open.

**Rejected:** the reflow plus `refresh(true)` (section 3); the 5% ghost (section
3); six cycling accent colours, where we have one red; the per-scroll
`getBoundingClientRect()` loop over every block (section 3); and the content
shape. Their six rows are one-word values with a supporting sentence, "Depth: we
look beneath the surface to solve the real problem", which is precisely the
pastable claim-plus-agreement structure this section was rebuilt to escape. The
mechanic is worth borrowing; what it carries there is not.

## 8. Flagged, fixed elsewhere

- `Principles.md:100` — the P7 cost of holding names YouTube and Instagram as
  channels LineiQ is absent from. Both are now the chosen channels. Stale
  regardless of anything on this page.
- **LinkedIn re-entry contradicts P7 "One Channel, Well."** Raised during the
  session that produced this document and deliberately left undecided here. It
  needs its own pass through the identity docs, not a side effect of a layout
  decision. Section 1 re-sources the affected row specifically so this section
  does not depend on the outcome.

## 9. Next

`/work` is a `<Placeholder>` and is not in the nav (`Navbar.tsx:17`). The Dream
Outcome Process does not appear anywhere in `src/`. Against the persona's trust
ladder, "visible method depth" and "accurate diagnosis" have no surface on the
site at all, while this page covers the other two rungs well. After this section
ships, About is done and the next build is the method surface. Case studies are
blocked on having clients; the method is not.

## 10. Changed during implementation

Three things the plan got wrong, all found in the browser rather than in review.

**The reveal fired 150vh too early, and was over before the section was on
screen.** The driver's start and end resolved to 2085 and 2945 while the rows
container actually sat at 4083. The gap is exactly the pin spacer
`AboutCompounds` adds. ScrollTrigger refreshes triggers in creation order at
equal priority, and `AboutCompounds` resolves its mode after hydration, so its
pin is created *after* this driver: measured in creation order, this section is
read at its unpinned position. Symptom was the last row stuck open from the
moment the section appeared, having burned the whole sequence inside the pinned
section above. Fixed with `refreshPriority: -1`, which puts this trigger last in
the refresh queue, after the pin spacing is applied. Two `ScrollTrigger.refresh()`
calls had already run at that point and neither corrected it, so this is an
ordering problem rather than a timing one.

**Measuring once at mount was not enough either.** The reserved height has to be
recomputed whenever anything else on the page does, so it is now taken in a
`refreshInit` listener rather than in a one-shot `setup()`. That also removed a
double-measure, since `setup()` had been measuring and then triggering a refresh
that measured again.

**GSAP was not tweening the colour at all.** `gsap.to(el, { color: "var(--color-red)" })`
writes the literal `var(...)` string as an inline style: the variable resolves,
so it looks right in a screenshot, but there is no interpolation and the colour
snaps. The tokens are now read once through `getComputedStyle` and the resolved
values handed to GSAP, so the tokens stay the source of truth and the flash
actually animates.

Also corrected during the same pass: `measure()` now suppresses transitions and
forces every row closed before reading, restoring the open row afterwards. Called
while row one was open, or mid-transition, it counted a cost block twice and
reserved too much height.

## 11. The seam, and row one's screen time

Added after the first build, from looking at the page rather than the numbers.

**900px of empty black.** `AboutCompounds` pins its stage for 150vh and releases
at scrollY 3055, but its section does not end until 3955, because a 100vh stage
still has to scroll its own height away after the pin lets go. The word has
lifted out well before that, so the reader crosses a full viewport of black with
nothing in it to reach this section.

Fixed from this side, without touching the tuned motion above: `section.beliefs`
takes a negative `margin-top` of `clamp(220px, 45vh, 480px)` and pulls the white
up over most of the runway. Same idiom as the homepage, where `.rise` pulls the
Manifesto panel over the end state of the pinned Partners sequence. Dead black
goes from 900px to 495px on desktop and 464px on a phone, both comfortably clear
of the pin release, so white never slides over a pinned element.

**Row one was never seen on white.** Separate symptom, same seam. With the
driver at `start: "top 72%"`, row one's open window ran while the rows sat 476
to 648px down the viewport, under the black, half below the fold, and it handed
off to row two within a few pixels of the black clearing. Row one had no life on
a white screen at all, which made the section feel like it began already in
progress.

Two changes together, because neither is sufficient alone:

- `padding-top` on the section goes to `clamp(220px, 34vh, 420px)`, well above
  the `--space-3xl` every other section gets. Moving the driver alone would have
  opened row one nearer the top of the screen, not lower down it.
- The driver window moves to `start: "top 30%"`, `end: "bottom 20%"`.

Measured after: rows one through five now first open fully on white at 339, 398,
284, 281 and 258px down the viewport. Row one holds for roughly 210px of scroll
on a white screen, which is the same screen time the other four get.

Note the trade, since it partly undoes the pull: the padding gives back scroll
distance that the negative margin took away. That is the intended exchange. The
page is 9124px rather than 9351px, and ~230px of dead black has become white
with the section's own content in it.

## 12. Verified

`tsc --noEmit`, eslint and `next build` all clean.

Measured in Chromium at 1440x900, scrolling with real wheel events through Lenis
(`window.scrollTo` bypasses Lenis, so `ScrollTrigger.update` never fires and the
state appears frozen — an early test result that was a harness artefact, not a
bug):

- **Page height constant.** 9124px at every sample across the full pass over the
  section. The goal in section 3 holds: no reflow, so nothing above or below is
  ever recomputed mid-scroll.
- **All five rows open in order**, each one fully on a white screen when it
  opens, at 339, 398, 284, 281 and 258px down the viewport (section 11).
- **Reduced motion:** the `enhanced` class is never applied, height stays auto,
  5/5 costs visible, 5/5 convictions at full black.
- **No JS:** 5/5 costs visible.
- **Mobile, 390x844:** all five rows open in sequence, document height constant
  at 9451px, and the rows content fits inside the reserved height with no
  overflow. The seam clears the pin release by 464px.
- No console or page errors in any mode.
