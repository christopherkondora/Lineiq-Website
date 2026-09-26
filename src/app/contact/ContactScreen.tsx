"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import CtaSwap from "../components/CtaSwap";
import styles from "./page.module.css";
import {
  buildContactLine,
  measureNodeLengths,
  type NodeLengths,
} from "./contactLine";

// /contact, rebuilt. The PRD is [[docs/website/2026-09-25-contact-line-path]] in
// the vault; the short version of what changed and why:
//
// The four-step wizard is gone. Scope and budget are gone with it — the pricing
// model is two-step and conditional, with the numbers written into an annex at
// the close of the Act 1 diagnosis, so a band picked off a slider by a stranger
// is a question we cannot act on and a package selector the persona rejects on
// sight. One question in our own voice does the work both of them were doing.
//
// The red line is the page's one gesture. It sweeps in from the left edge under
// the statement, turns, and runs down the left margin of the field stack, and
// its head sits on the field you have to fill next. It is the progress
// indicator and the brand's line idiom at once, which is why the old tick row
// is not here: two indicators for one state is one too many. It measures
// answers given and nothing else — never scroll position, which is the trick
// the reference site plays.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Placeholder copy. Shape-accurate only; the copy pass comes last and once.
 *  No em-dash on this page: Voice v2, and this is outward-facing. */
const HEADING = "Let's talk for real.";
const LEDE =
  "Three clients a year. Tell us what you are building and we will tell you straight whether we are the studio for it.";
const DIRECT_EMAIL = "hello@lineiqgroup.com";
const QUESTION = "What are you trying to build, and what is in the way?";

type FieldKey = "name" | "email" | "company" | "message";

const EMPTY: Record<FieldKey, string> = {
  name: "",
  email: "",
  company: "",
  message: "",
};

/** Field order is the order of everything: DOM, tab, and the line's nodes. */
const FIELD_ORDER: FieldKey[] = ["name", "email", "company", "message"];

function isValid(key: FieldKey, value: string): boolean {
  if (key === "email") return EMAIL_RE.test(value.trim());
  return value.trim().length > 0;
}

/**
 * An element's position relative to the section, in layout coordinates.
 *
 * getBoundingClientRect would be shorter and wrong: the fields carry the
 * site's `.reveal` class, which holds them 60px down on a transform until the
 * arrival tween clears it, and a rect includes that transform. Measuring
 * mid-reveal put the spine's last node sixty pixels above the submit control.
 * offsetTop is pure layout and does not move.
 */
function layoutOffset(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

export default function ContactScreen() {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const entryRef = useRef<HTMLSpanElement>(null);
  const formColRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});

  /** Where the nodes sit along the path, from the last measurement. A ref,
   *  not state: the tween reads them, nothing renders off them. */
  const nodesRef = useRef<NodeLengths | null>(null);
  const drawnRef = useRef(false);
  /** The resize handler runs outside React's render, so it reads the answer
   *  count off a ref rather than closing over a stale one. */
  const answeredRef = useRef(0);

  // How many answers are in. The line's head goes to node[answered], so with
  // nothing filled it rests on the first field, and with everything filled it
  // reaches the stub under Send.
  //
  // Counted, not measured as a leading run: filling the email before the name
  // should move the line. Tying it to the first unanswered field instead would
  // leave a form that is three-quarters full showing no progress at all, which
  // reads as broken rather than as strict.
  const answered = FIELD_ORDER.filter((k) => isValid(k, values[k])).length;
  const complete = answered === FIELD_ORDER.length;

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Rebuild the path against the current layout. Returns false if anything it
   *  needs is missing or the page is not laid out yet. */
  const remeasure = useCallback((): boolean => {
    const root = rootRef.current;
    const path = pathRef.current;
    const svg = svgRef.current;
    const formCol = formColRef.current;
    const send = sendRef.current;
    if (!root || !path || !svg || !formCol || !send) return false;
    if (root.offsetWidth < 2 || root.offsetHeight < 2) return false;

    // The anchor exists only in the two-column layout, and its absence is how
    // the phone layout is detected: the CSS breakpoint stays the single source
    // of truth rather than being repeated as a number here.
    const entryEl = entryRef.current?.offsetParent ? entryRef.current : null;

    const fieldYs: number[] = [];
    let fieldsLeft = Infinity;
    for (const key of FIELD_ORDER) {
      const el = fieldRefs.current[key];
      if (!el) return false;
      const pos = layoutOffset(el, root);
      fieldYs.push(pos.y + el.offsetHeight);
      // The fields' own left edge, not the column's: on a phone the column is
      // padded to open a margin for the spine, and the column box starts
      // outside that padding.
      fieldsLeft = Math.min(fieldsLeft, pos.x);
    }

    const sendPos = layoutOffset(send, root);

    // The spine sits in the field stack's left margin. The gap is smaller on a
    // phone because the margin it has to live in is the page's own padding.
    const gap = root.offsetWidth < 768 ? 14 : 26;

    const plan = buildContactLine(
      entryEl ? { x: 0, y: layoutOffset(entryEl, root).y } : null,
      fieldsLeft - gap,
      fieldYs,
      sendPos.y + send.offsetHeight + 8,
      sendPos.x + send.offsetWidth
    );

    svg.setAttribute("viewBox", `0 0 ${root.offsetWidth} ${root.offsetHeight}`);
    path.setAttribute("d", plan.d);

    const measured = measureNodeLengths(path, plan.nodes);
    if (!measured.total) return false;
    nodesRef.current = measured;
    // The gap is twice the dash so no wrap of the pattern can leave a tail
    // showing at the end of the path while the head is still on its way.
    path.style.strokeDasharray = `${measured.total} ${measured.total * 2}`;
    return true;
  }, []);

  /** Put the head on the node the current answer count has earned. */
  const setHead = useCallback((immediate: boolean) => {
    const path = pathRef.current;
    const measured = nodesRef.current;
    if (!path || !measured) return;
    const i = Math.min(answeredRef.current, measured.at.length - 1);
    const target = measured.total - measured.at[i];
    if (immediate || reduced()) {
      gsap.set(path, { strokeDashoffset: target });
      return;
    }
    gsap.to(path, {
      strokeDashoffset: target,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  // Measure, then draw once.
  //
  // The first measurement is taken as soon as the fonts settle, and every
  // later one comes from the observer below. That split matters: in
  // development document.fonts.ready can resolve before the face has been
  // requested at all, so the first pass is sometimes measured against the
  // fallback. The observer catches the reflow when the real face lands, and
  // everything else that moves the column afterwards.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    const formCol = formColRef.current;
    const path = pathRef.current;
    if (!root || !formCol || !path) return;

    let cancelled = false;

    const start = () => {
      if (cancelled || drawnRef.current) return;
      if (!remeasure()) return;
      const measured = nodesRef.current;
      if (!measured) return;
      drawnRef.current = true;

      const target = measured.total - measured.at[0];
      if (reduced()) {
        gsap.set(path, { strokeDashoffset: target });
        return;
      }
      gsap.to(path, {
        strokeDashoffset: target,
        duration: 1.8,
        delay: 0.15,
        ease: "power3.inOut",
      });
    };

    void (document.fonts?.ready ?? Promise.resolve()).then(start);
    // Fallback for the case where the font promise never settles.
    const t = window.setTimeout(start, 1200);

    // Rebuilding keeps the nodes on the fields through a resize, a late font,
    // and anything else that moves the column. The dash pattern and the offset
    // are both rewritten from the new measurement in the same frame, so the
    // head stays on its node and the line neither redraws nor jumps. Once the
    // form is replaced by the confirmation there is nothing to measure, and
    // remeasure says so.
    const ro = new ResizeObserver(() => {
      if (!drawnRef.current || !remeasure()) return;
      // Mid-draw the head is still travelling, so it is retargeted rather than
      // snapped; settled, the geometry has changed under it and a snap is the
      // honest move.
      setHead(!gsap.isTweening(path));
    });
    ro.observe(root);
    ro.observe(formCol);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      ro.disconnect();
      gsap.killTweensOf(path);
    };
  }, [remeasure, setHead]);

  // Every answer moves the head one node down the spine. Both directions:
  // emptying a field pulls the line back, because a progress indicator that
  // only ever advances is decoration.
  useEffect(() => {
    answeredRef.current = answered;
    if (!drawnRef.current || done) return;
    setHead(false);
  }, [answered, done, setHead]);

  // On submit the form leaves and the confirmation takes its place, so every
  // field the path was measured against is gone. The line finishes its run and
  // then goes with them rather than hanging over new content it does not fit.
  useEffect(() => {
    if (!done) return;
    const path = pathRef.current;
    if (!path) return;
    if (reduced()) {
      gsap.set(path, { opacity: 0 });
      return;
    }
    gsap
      .timeline()
      .to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" })
      .to(path, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.2");
  }, [done]);

  // The columns arrive once, on load.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced()) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-reveal]"), {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.1,
        ease: "power3.out",
        // No clearProps here, and it is not an oversight. Clearing the inline
        // transform re-exposes the one the global `.reveal` class sets, so the
        // elements settle 60px below where they were laid out. Invisible on a
        // page where everything shifts together; fatal here, where the line is
        // drawn from layout coordinates and the two have to agree.
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const set = (key: FieldKey) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!isValid("name", values.name)) {
      setError("We need a name, so we know who we are replying to.");
      return;
    }
    if (!isValid("email", values.email)) {
      setError("We need a valid email address, so we have somewhere to reply.");
      return;
    }
    if (!isValid("company", values.company)) {
      setError("Without a company name we cannot prepare for the call.");
      return;
    }
    if (!isValid("message", values.message)) {
      setError("Answer the question and we will have something to work with.");
      return;
    }

    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          message: values.message.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Submission failed, please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Submission failed, please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section ref={rootRef} className={styles.screen}>
      <svg
        ref={svgRef}
        className={styles.line}
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
      >
        {/* The hidden start state is CSS, so nothing is painted between
            first paint and hydration. The real dash pattern arrives with the
            first measurement. */}
        <path ref={pathRef} className={styles.linePath} fill="none" />
      </svg>

      <div className={`container ${styles.inner}`}>
        <div className={styles.saying}>
          {/* Where the line crosses the left edge. Zero height, no content:
              its only job is to be measurable.

              It sits ABOVE the statement, and that is the whole routing
              decision. Entering below the copy and climbing to the form's
              first field means crossing the column diagonally, which put the
              line straight through the heading and the lede in the first
              build. Entering above it, the line runs clear of everything and
              arrives at the form on a gentle rise. */}
          <span
            ref={entryRef}
            className={styles.lineAnchor}
            aria-hidden="true"
          />
          <h1 className={`reveal ${styles.title}`} data-reveal>
            {HEADING}
          </h1>
          <p className={`reveal ${styles.lede}`} data-reveal>
            {LEDE}
          </p>
          <a
            className={`reveal ${styles.direct}`}
            data-reveal
            href={`mailto:${DIRECT_EMAIL}`}
          >
            {DIRECT_EMAIL}
          </a>
        </div>

        <div className={styles.formCol} ref={formColRef}>
          {/* The form stays mounted while sending, and is replaced only once
              the submission is accepted.

              noValidate is deliberate: the fields keep their `required` for
              assistive tech, but the browser's own bubbles would fire before
              onSubmit and say it in a voice that is not ours. */}
          {!done && (
          <form onSubmit={onSubmit} className={styles.form} noValidate>
            <div className={`reveal ${styles.field}`} data-reveal>
              <label className={styles.label} htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                ref={(el) => {
                  fieldRefs.current.name = el;
                }}
                className={styles.input}
                type="text"
                value={values.name}
                onChange={(e) => set("name")(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className={`reveal ${styles.field}`} data-reveal>
              <label className={styles.label} htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                ref={(el) => {
                  fieldRefs.current.email = el;
                }}
                className={styles.input}
                type="email"
                value={values.email}
                onChange={(e) => set("email")(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className={`reveal ${styles.field}`} data-reveal>
              <label className={styles.label} htmlFor="contact-company">
                Company
              </label>
              <input
                id="contact-company"
                ref={(el) => {
                  fieldRefs.current.company = el;
                }}
                className={styles.input}
                type="text"
                value={values.company}
                onChange={(e) => set("company")(e.target.value)}
                autoComplete="organization"
                required
              />
            </div>

            <div className={`reveal ${styles.field}`} data-reveal>
              <label
                className={`${styles.label} ${styles.questionLabel}`}
                htmlFor="contact-message"
              >
                {QUESTION}
              </label>
              <textarea
                id="contact-message"
                ref={(el) => {
                  fieldRefs.current.message = el;
                }}
                className={`${styles.input} ${styles.textarea}`}
                value={values.message}
                onChange={(e) => set("message")(e.target.value)}
                rows={3}
                autoComplete="off"
                required
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <div className={`reveal ${styles.actions}`} data-reveal>
              <button
                ref={sendRef}
                type="submit"
                className={`${styles.sendBtn} ${complete ? styles.sendLive : ""}`}
                disabled={sending}
              >
                <CtaSwap
                  defaultLabel={sending ? "Sending…" : "Send"}
                  hoverLabel="Let's go!"
                />
              </button>
            </div>
          </form>
          )}

          {done && (
            <div className={styles.doneBlock} role="status">
              <h2 className={styles.doneTitle}>Got it.</h2>
              <p className={styles.doneSignature} aria-hidden="true">
                talk soon.
              </p>
              <div className={styles.doneGrid}>
                <div>
                  <p className="text-label">Next step</p>
                  <p className={styles.doneText}>
                    We will read your answer against your market, and arrive at
                    the first call already having something to say.
                  </p>
                </div>
                <div>
                  <p className="text-label">Response time</p>
                  <p className={styles.doneText}>
                    You will hear back by email within 48 hours on business
                    days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
