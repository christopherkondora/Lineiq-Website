---
type: prd
status: parked
created: 2026-09-11
updated: 2026-09-11
---

# /contact: rework notes, parked

Not scheduled. Written down on 2026-09-11 so the research is not lost, then
deliberately set aside to keep that session on `/about`. Nothing here has been
agreed; it is a reference point plus one live bug.

## The live bug, which is independent of any rework

`IntakeFlow.tsx:17`:

```ts
const BUDGET_OPTIONS = ["Under 1M Ft", "1–5M Ft", "Over 5M Ft"];
```

Forint bands on a site whose ICP is explicitly global and English-speaking, with
the Hungarian market priority retired (`docs/lineiq_icp.md` section 2). The
target client either cannot parse the figure or reverse-translates it to roughly
2,500 to 12,500 euro and concludes the studio is small. Every other word on the
page is in English and the one question about money is not.

There is also a leftover Hungarian comment on the line above it.

This is worth fixing on its own, before and regardless of any structural change.

## The reference

`wearedirect.co/contact`, ripped to `C:\Claude Code Projects\wearedirect.co-contact`.
The working code is in the inline scripts of `assets/wearedirect.co/contact.html`.

Four `[data-step]` sections stacked on one scrollable page. Nothing hidden, no
modal. A sticky header carries `01/03 Select Scope`, `02/03 Select Budget`,
`03/03 Select Timeline` and a fill bar.

- **The choice and the advance are one object.** Selecting a card inverts it and
  swaps its inner button label to "Next Step" (`contact.html:2795`); clicking
  that runs `lenis.scrollTo` to the next section. There is no separate Continue
  control anywhere on the page.
- Step one is multi-select (`data-multiselect`), steps two and three single.
- Scope cards carry a "What's Included" list, so the form sells while it asks.
- Step four is a live summary of the three answers, each one a `data-target`
  back-link that scrolls to that step to change it.
- Then name, company, country, email, optional message, privacy checkbox.
  Per-field validation on `input`; submit held at `opacity: 0.4` until the
  checkbox is ticked.
- Qualification is asked **before** identification: scope, budget and timeline
  come before name and email.

## Worth taking

1. **Stop hiding steps.** All questions on one scrollable page. Removes the
   wizard's "how many more are there" anxiety while still reading as guided.
2. **Card-as-button.** Selecting an option and advancing should be one gesture.
3. **The clickable summary** before the contact fields.

## Worth refusing

**Every option pre-selected.** `filters.forEach((filter, i) => setFilterState(filter, i === 0))`
selects the first card in every grid on load, so the summary reads
*Brand Identity, From 5k-10k$, 1month* before the visitor has touched anything.
It lowers friction and destroys the signal: a lead claiming the first option in
all three fields is indistinguishable from one who never looked. For a studio
that disqualifies 60 to 70% of inbound (`Principles.md:120`), "no answer" is
information worth keeping.

**Budget bands as a card grid.** A grid of price tiers reads as packages, which
`Deep Research - Pillar-4-Persona.md` lists among the things Daniel rejects on
sight, alongside templates and "10x your authority". One plain question in our
own voice does the same job without the menu.

**`window.alert()` as the confirmation** (`contact.html:2736`), a system dialog
with an emoji at the end of a page art-directed to the pixel. Their own
`.w-form-done` and `.w-form-fail` blocks sit unused in the markup.

**The progress bar measured against scroll position**, not answers given:
`(scrollY - step1Top) / (step3Top - step1Top)`. A reading indicator dressed as a
completion indicator.

**`ScrollTrigger.refresh(true)` on every selection**, fired whenever the summary
text changes length. The same pattern designed around in
`2026-09-11-about-beliefs-scroll-reveal.md` section 3.

## Where ours is already ahead

`src/app/contact/IntakeFlow.tsx` posts to a real server route at
`/api/contact`. The reference sends from the client through EmailJS with the
service and template IDs readable in the page source, and falls back to a
`method="get"` form with no action if JS fails. Any rework keeps our backend.

## If this is picked up

Grill the flow before building it, the same way `/about`'s beliefs section was
handled. The open question is not which mechanic to copy but whether a
qualification flow is the right shape at all for a studio taking three clients a
year, given that the persona flinches at anything resembling a package selector.
