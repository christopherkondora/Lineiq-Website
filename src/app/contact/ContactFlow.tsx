"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import CtaSwap from "../components/CtaSwap";
import Footer from "../components/Footer";
import styles from "./page.module.css";
import {
  BUDGET_BANDS,
  EMAIL_RE,
  HONEYPOT_FIELD,
  NEEDS,
  STAGES,
  labelOf,
  type BudgetMode,
  type NeedId,
  type StageId,
} from "./intake";

// /contact, rebuilt: one question, one viewport.
//
// The previous build put five staggered steps in a single screen with a red
// line winding between them and a camera riding the line's head. It was
// rejected on sight, and the reason is worth writing down: five steps visible
// at once is a form, and a form asks a stranger to survey the whole job before
// doing any of it. The line was answering a question nobody had.
//
// So the composition is inverted. Every question owns a whole viewport, at a
// size nothing else on the screen competes with, and answering moves the
// world: the track of panels is translated so the next question lands where
// the last one was. Two axes carry the travel, and both are deliberate.
//
//   y — one viewport per panel, measured from layout rather than multiplied out
//       of a viewport constant, so a panel that has to grow on a short phone
//       does not put every panel after it out of register.
//   x — each panel's content sits at its own lateral offset and the camera
//       cancels it, so the question always arrives at the same reading
//       position while the panels leaving and arriving sweep sideways past it.
//       Without the x this is a slideshow. With it, it is a camera.
//
// No line. The progress readout is a number, because the honest answer to "how
// far in am I" is two digits, and one gesture per page is the rule.
//
// The intake contract is untouched: [[contact/intake]] still owns the ids and
// the API route still validates against the same lists.

/** Shape-accurate placeholders. The copy pass comes last and once. No em-dash
 *  anywhere: Voice v2, and this page is outward-facing. */
const HEADING = "Let's talk for real.";
const LEDE =
  "Three clients a year. Five questions, and you will know where you stand.";
const ASIDE = "Or just hit us up.";
const DIRECT_EMAIL = "hello@lineiqgroup.com";

// The panels, by name. The indices are read by the camera, the counter and the
// review rows, and a bare number in three places is how those drift apart.
const P_STATEMENT = 0;
const P_WHO = 1;
const P_STAGE = 2;
const P_NEED = 3;
const P_BUDGET = 4;
const P_NOTE = 5;
const P_REVIEW = 6;
const LAST = P_REVIEW;

/** What each panel asks. The statement and the review are not questions and are
 *  not counted: the page promises five and shows five. */
const QUESTIONS: Record<number, string> = {
  [P_WHO]: "Who are you?",
  [P_STAGE]: "Where's the money now?",
  [P_NEED]: "What do you need?",
  [P_BUDGET]: "What can you put behind it?",
  [P_NOTE]: "Anything we should know?",
};

const COUNTED = [P_WHO, P_STAGE, P_NEED, P_BUDGET, P_NOTE];

/**
 * Each panel's lateral offset, as a fraction of `--sway`.
 *
 * Unequal on purpose. Equal alternating amplitudes read as a mechanical wave
 * and the eye predicts the next one after the second gap; these values give
 * every leg of the travel a different width. The statement and the review are
 * both flush, so the journey starts and ends in the same place.
 *
 * What matters to the eye is not the offset but the difference between two
 * neighbours: that difference over one viewport of height is the angle of the
 * leg. Every consecutive pair here is at least a third of the sway apart, so
 * no leg of the journey comes down straight.
 */
const BIAS: Record<number, number> = {
  [P_STATEMENT]: 0,
  [P_WHO]: 0.2,
  [P_STAGE]: 0.66,
  [P_NEED]: 0.3,
  [P_BUDGET]: 0.74,
  [P_NOTE]: 0.36,
  [P_REVIEW]: 0,
};

/** How long a chosen option stays on screen before the camera takes it away.
 *  Under about a quarter second the fill never reads and the click feels like
 *  it went somewhere else. */
const COMMIT_HOLD_MS = 340;

/** The travel, in seconds. Long enough to be a journey rather than a cut: the
 *  distance is a whole viewport and most of a sway, and at under a second the
 *  eye reads the arrival and misses the move. */
const TRAVEL = 1.4;

/**
 * How far a panel's content lags behind, or runs ahead of, the camera carrying
 * it, as a fraction of the distance still to go.
 *
 * Without this the travel is two screens sliding past each other with a
 * viewport of white between them, because every question is vertically centred
 * in its own cell and the space between two centres is empty by construction.
 * With it the question leaving drags and the question arriving leads, the gap
 * closes by a fifth, and the two read as one move through a space rather than
 * as a transition between slides.
 */
const PARALLAX = 0.24;

interface Pt {
  x: number;
  y: number;
}

/**
 * One viewport.
 *
 * Module level, not a closure inside the screen: a component declared inside a
 * render is a new type on every render, and React would unmount the subtree on
 * each keystroke and take the caret with it.
 *
 * `inert` on every panel that is not the active one is load-bearing, not
 * politeness. The other six are off screen but in the DOM, and without it the
 * first Tab press walks into a question the visitor cannot see. It waits for
 * the camera, though: until the camera is running this page is a column that
 * scrolls, and locking six of its seven screens would be locking the page.
 */
function Panel({
  index,
  kind,
  active,
  locked,
  panelRef,
  holderRef,
  children,
}: {
  index: number;
  kind: "statement" | "question" | "review";
  active: boolean;
  locked: boolean;
  panelRef: (el: HTMLDivElement | null) => void;
  holderRef: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      className={styles.panel}
      data-panel={index}
      data-kind={kind}
      data-active={active}
      inert={locked}
    >
      <div
        ref={holderRef}
        className={styles.holder}
        style={{ "--bias": BIAS[index] } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** A question's heading, and nothing above it. The screen carries one question
 *  at display scale and the count belongs to the readout at the foot of the
 *  page, which is the one thing on this page that does not travel. */
function Ask({ index }: { index: number }) {
  return (
    <h2 className={styles.ask} id={`q-${index}`}>
      {QUESTIONS[index]}
    </h2>
  );
}

export default function ContactFlow() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<StageId | null>(null);
  const [need, setNeed] = useState<NeedId | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("monthly");
  const [band, setBand] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const [at, setAt] = useState(P_STATEMENT);
  const [travelOn, setTravelOn] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const trackRef = useRef<HTMLFormElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const holderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const honeypotRef = useRef<HTMLInputElement>(null);

  /** One stable setter per panel. An inline arrow would be a new ref callback
   *  every render, which React detaches and reattaches each time. */
  const panelRefSetters = useMemo(
    () =>
      Array.from(
        { length: LAST + 1 },
        (_, i) => (el: HTMLDivElement | null) => {
          panelRefs.current[i] = el;
        }
      ),
    []
  );
  const holderRefSetters = useMemo(
    () =>
      Array.from(
        { length: LAST + 1 },
        (_, i) => (el: HTMLDivElement | null) => {
          holderRefs.current[i] = el;
        }
      ),
    []
  );

  /** Where the camera rests on each panel, in track coordinates. */
  const stopsRef = useRef<Pt[]>([]);
  const camRef = useRef<Pt>({ x: 0, y: 0 });
  const measuredRef = useRef(false);
  const atRef = useRef(P_STATEMENT);
  const maxRef = useRef(P_STATEMENT);
  const holdTimer = useRef(0);

  /** When the flow was mounted. The difference at submit time is the timing
   *  check the route runs: nothing a human fills in takes under three seconds.
   *  Stamped in an effect, so it is a client clock reading and not a server
   *  one. */
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── What is answered ──────────────────────────────────────
  // Per panel: whether the flow may move past it. The note is optional, which
  // is what makes it the last question; the review is never filled, which is
  // what makes it the end.
  const whoOk = company.trim().length > 0 && EMAIL_RE.test(email.trim());
  const filled: boolean[] = [
    true,
    whoOk,
    stage !== null,
    need !== null,
    band !== null,
    true,
    false,
  ];

  /** The furthest panel the answers have earned. Answering out of order is not
   *  possible here, so this is also the only panel that can be entered fresh. */
  const unfilled = filled.findIndex((v) => !v);
  const maxIndex = unfilled === -1 ? LAST : unfilled;

  // Mirrored into a ref because the wheel and key listeners are bound once and
  // read it from outside React's render, and rebinding a window listener on
  // every keystroke to close over a fresh value is the worse trade.
  useEffect(() => {
    maxRef.current = maxIndex;
  }, [maxIndex]);

  // ── The camera ────────────────────────────────────────────

  /** Rebuild the stops against the current layout. The panels are viewport
   *  cells in the stylesheet whether the camera is running or not, so this is
   *  valid before the first translate and after every reflow. */
  const measure = useCallback((): boolean => {
    const track = trackRef.current;
    if (!track || track.offsetHeight < 2) return false;
    const base = holderRefs.current[P_STATEMENT];
    if (!base) return false;
    const stops: Pt[] = [];
    for (let i = 0; i <= LAST; i++) {
      const panel = panelRefs.current[i];
      const holder = holderRefs.current[i];
      if (!panel || !holder) return false;
      // The x cancels the panel's own lateral offset, so every question lands
      // at the statement's reading position wherever it is laid out.
      stops.push({
        x: base.offsetLeft - holder.offsetLeft,
        y: -panel.offsetTop,
      });
    }
    stopsRef.current = stops;
    measuredRef.current = true;
    return true;
  }, []);

  /**
   * One write, every frame, for the whole page: the track takes the camera, and
   * each panel's content takes its own share of the distance the camera still
   * has to cover to reach it.
   *
   * The holders' transform is owned here and nowhere else. That is why the dim
   * on an inactive panel is opacity only: a CSS transition on transform would
   * be fighting these writes for the whole of every travel.
   */
  const write = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { x, y } = camRef.current;
    gsap.set(track, { x, y });

    const stops = stopsRef.current;
    // Clamped, so panels the camera is nowhere near sit at a fixed offset
    // instead of being dragged a thousand pixels out of their own cell.
    const reach = window.innerHeight * 1.2;
    for (let i = 0; i < stops.length; i++) {
      const holder = holderRefs.current[i];
      if (!holder) continue;
      const d = Math.max(-reach, Math.min(reach, y - stops[i].y));
      gsap.set(holder, { y: -d * PARALLAX });
    }
  }, []);

  const focusPanel = useCallback((index: number) => {
    // Never on a touch screen: focusing a field there throws the keyboard up
    // over the question that is still arriving.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const panel = panelRefs.current[index];
    const control = panel?.querySelector<HTMLElement>(
      "input:not([type='hidden']), button, [href]"
    );
    control?.focus();
  }, []);

  const travel = useCallback(
    (index: number, immediate: boolean, focus: boolean) => {
      const track = trackRef.current;
      const stop = stopsRef.current[index];
      if (!track || !stop) return;
      const cam = camRef.current;
      gsap.killTweensOf(cam);
      if (immediate || reduced()) {
        cam.x = stop.x;
        cam.y = stop.y;
        write();
        if (focus) focusPanel(index);
        return;
      }
      gsap.to(cam, {
        x: stop.x,
        y: stop.y,
        // The world has to leave and arrive. An out-ease starts at full speed,
        // which reads as a snap followed by a glide: this is the one place on
        // the site where the ease-in matters as much as the ease-out.
        //
        // power2 rather than power3 now that the travel is long: a cubic
        // in-out over 1.4s spends so much of itself near a standstill at both
        // ends that the middle has to sprint, and the journey reads as two
        // pauses with a lurch between them.
        duration: TRAVEL,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: write,
        onComplete: () => {
          if (focus) focusPanel(index);
        },
      });
    },
    [focusPanel, write]
  );

  /** The one way the flow moves. Everything else calls this. */
  const goTo = useCallback(
    (index: number, opts?: { immediate?: boolean; focus?: boolean }) => {
      const target = Math.max(0, Math.min(index, LAST));
      window.clearTimeout(holdTimer.current);
      setError("");
      atRef.current = target;
      setAt(target);
      travel(target, opts?.immediate ?? false, opts?.focus ?? true);
    },
    [travel]
  );

  /** An answer given by clicking. The hold is so the selection is seen before
   *  the screen it is on leaves. */
  const commit = useCallback(
    (from: number) => {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = window.setTimeout(() => {
        if (atRef.current !== from) return;
        goTo(from + 1);
      }, COMMIT_HOLD_MS);
    },
    [goTo]
  );

  // Measure, then take the camera. The lock on the stage goes on in the same
  // commit as the first translate, so there is never a frame where the page can
  // be scrolled and translated at once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const start = () => {
      if (cancelled || measuredRef.current) return;
      if (!measure()) return;
      // A reload restores the old scroll position, and locking the stage under
      // a scrolled window would leave the first question above the fold.
      window.scrollTo(0, 0);
      travel(atRef.current, true, false);
      setTravelOn(true);
    };

    void (document.fonts?.ready ?? Promise.resolve()).then(start);
    // For the case where the font promise never settles.
    const t = window.setTimeout(start, 1200);

    // A late font, a rotation, a resize: the stops are rebuilt and the camera
    // is put back on its current panel in the same frame, so nothing drifts and
    // nothing animates.
    const ro = new ResizeObserver(() => {
      if (!measuredRef.current) return;
      if (!measure()) return;
      travel(atRef.current, true, false);
    });
    const track = trackRef.current;
    if (track) ro.observe(track);

    const cam = camRef.current;
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      ro.disconnect();
      gsap.killTweensOf(cam);
    };
  }, [measure, travel]);

  // The statement arrives. Once, on load, and only the first panel: every other
  // panel is brought in by the camera.
  useEffect(() => {
    if (typeof window === "undefined" || reduced()) return;
    const holder = holderRefs.current[P_STATEMENT];
    if (!holder) return;
    const tween = gsap.to(holder.querySelectorAll("[data-reveal]"), {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.15,
      ease: "power3.out",
    });
    return () => {
      tween.kill();
    };
  }, []);

  // The wheel travels. It is the gesture this page looks like it should have,
  // and refusing it is how a one-question-per-screen flow feels broken: the
  // visitor spins the wheel, nothing moves, and they conclude the page is stuck
  // rather than that it is strict.
  useEffect(() => {
    if (!travelOn || done) return;
    let lock = 0;
    const onWheel = (e: WheelEvent) => {
      // A panel too tall for the viewport keeps its own wheel until it has been
      // read to the end. Short phones, mostly.
      const panel = panelRefs.current[atRef.current];
      if (panel && panel.scrollHeight > panel.clientHeight + 2) {
        const top = panel.scrollTop <= 0;
        const bottom =
          panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
        if ((e.deltaY > 0 && !bottom) || (e.deltaY < 0 && !top)) return;
      }
      if (Math.abs(e.deltaY) < 24) return;
      const now = performance.now();
      if (now < lock) return;
      const next = atRef.current + (e.deltaY > 0 ? 1 : -1);
      if (next < 0 || next > maxRef.current) return;
      // Longer than the travel itself. A trackpad flick is fifty events and
      // every one of them would otherwise be a panel.
      lock = now + TRAVEL * 1000 + 250;
      goTo(next);
    };
    // The same argument on a phone, where the gesture is a drag. Tapping an
    // answer is still the way through; this is for the visitor who reaches the
    // end of a question and pushes the screen up out of habit.
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = touchY - endY;
      if (Math.abs(dy) < 60) return;
      const panel = panelRefs.current[atRef.current];
      if (panel && panel.scrollHeight > panel.clientHeight + 2) {
        const top = panel.scrollTop <= 0;
        const bottom =
          panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
        if ((dy > 0 && !bottom) || (dy < 0 && !top)) return;
      }
      const next = atRef.current + (dy > 0 ? 1 : -1);
      if (next < 0 || next > maxRef.current) return;
      goTo(next);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [travelOn, done, goTo]);

  // Keys, for everyone who does not point at things. Arrows are left alone
  // inside a field, where they belong to the caret.
  useEffect(() => {
    if (!travelOn || done) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea")) return;
      const forward = e.key === "ArrowDown" || e.key === "PageDown";
      const back = e.key === "ArrowUp" || e.key === "PageUp";
      if (!forward && !back) return;
      const next = atRef.current + (forward ? 1 : -1);
      if (next < 0 || next > maxRef.current) return;
      e.preventDefault();
      goTo(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [travelOn, done, goTo]);

  useEffect(() => {
    const timer = holdTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  // ── Answers ───────────────────────────────────────────────

  const pickStage = (id: StageId) => {
    setStage(id);
    commit(P_STAGE);
  };

  const pickNeed = (id: NeedId) => {
    setNeed(id);
    commit(P_NEED);
  };

  const pickBand = (id: string) => {
    setBand(id);
    commit(P_BUDGET);
  };

  /** Throwing the switch changes which four labels are on screen and nothing
   *  else. It clears the band, because a monthly id is not a one-time answer. */
  const throwSwitch = () => {
    window.clearTimeout(holdTimer.current);
    setBudgetMode((m) => (m === "monthly" ? "one-time" : "monthly"));
    setBand(null);
  };

  /**
   * Forward, by the button or by Enter.
   *
   * Every panel's primary control is a submit button, so the pointer and the
   * keyboard go through one path and Enter in a field cannot mean something
   * other than clicking what is under it. Only the last panel sends.
   */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (atRef.current < P_REVIEW) {
      if (!filled[atRef.current]) {
        if (atRef.current === P_WHO) {
          setError(
            company.trim().length === 0
              ? "We need the company name, so we know who we are looking at."
              : "We need a valid email address, so we have somewhere to reply."
          );
        }
        return;
      }
      goTo(atRef.current + 1);
      return;
    }

    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          email: email.trim(),
          stage,
          need,
          budget: { mode: budgetMode, band },
          note: note.trim(),
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - mountedAt.current,
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

  const bands = BUDGET_BANDS[budgetMode];
  const counted = COUNTED.indexOf(at) + 1;

  // The confirmation is not a panel. The travel is over, the questions are gone
  // from the DOM with the fields they held, and the page is allowed to scroll
  // again so the visitor can leave the way they leave every other page.
  if (done) {
    return (
      <>
        <section className={styles.stage}>
          {/* data-active, because the dim is written for the panels the camera
              is not on and this one is the only thing left on the page. */}
          <div className={styles.panel} data-active="true">
            <div className={styles.holder}>
              <div className={styles.doneBlock} role="status">
                <h2 className={styles.doneTitle}>Got it.</h2>
                <p className={styles.doneSignature} aria-hidden="true">
                  talk soon.
                </p>
                <div className={styles.doneGrid}>
                  <div>
                    <p className="text-label">Next step</p>
                    <p className={styles.doneText}>
                      We will read your answers against your market, and arrive
                      at the first call already having something to say.
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
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <section
      className={styles.stage}
      data-travel={travelOn ? "on" : undefined}
    >
      {/* The track is the form, so every panel's submit button is the same
          button and Enter works on the panel the visitor is standing on.
          noValidate is deliberate: the fields keep their `required` for
          assistive tech, but the browser's own bubbles would fire before
          onSubmit and say it in a voice that is not ours. */}
      <form
        ref={trackRef}
        onSubmit={onSubmit}
        className={styles.track}
        noValidate
      >
        {/* ── The statement ─────────────────────────────────
            The only screen that is not a question. It says what the flow is,
            and gives the visitor who would rather write than click somewhere
            else to go. */}
        <Panel
          index={P_STATEMENT}
          kind="statement"
          active={at === P_STATEMENT}
          locked={travelOn && at !== P_STATEMENT}
          panelRef={panelRefSetters[P_STATEMENT]}
          holderRef={holderRefSetters[P_STATEMENT]}
        >
          <h1 className={`${styles.rv} ${styles.title}`} data-reveal>
            {HEADING}
          </h1>
          <p className={`${styles.rv} ${styles.lede}`} data-reveal>
            {LEDE}
          </p>
          <div className={`${styles.rv} ${styles.foot}`} data-reveal>
            <button type="submit" className={styles.begin}>
              <CtaSwap defaultLabel="Begin" hoverLabel="Let's go!" />
            </button>
          </div>
          <p className={`${styles.rv} ${styles.aside}`} data-reveal>
            {ASIDE}
          </p>
          <a
            className={`${styles.rv} ${styles.direct}`}
            data-reveal
            href={`mailto:${DIRECT_EMAIL}`}
          >
            {DIRECT_EMAIL}
          </a>
        </Panel>

        {/* ── 01 Who ────────────────────────────────────────
            Two fields, because they are one question. The person's name is not
            here and that was a ruling, not an oversight: the reply template has
            to work without one. */}
        <Panel
          index={P_WHO}
          kind="question"
          active={at === P_WHO}
          locked={travelOn && at !== P_WHO}
          panelRef={panelRefSetters[P_WHO]}
          holderRef={holderRefSetters[P_WHO]}
        >
          <Ask index={P_WHO} />
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-company">
                Company
              </label>
              <input
                id="contact-company"
                className={styles.input}
                type="text"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="organization"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className={styles.foot}>
            <button type="submit" className={styles.next}>
              Next
            </button>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>
        </Panel>

        {/* ── 02 Money ──────────────────────────────────────
            Hard filter one. "Not selling yet" is an automatic no and the flow
            does not say so: the no is said by email, by a person. */}
        <Panel
          index={P_STAGE}
          kind="question"
          active={at === P_STAGE}
          locked={travelOn && at !== P_STAGE}
          panelRef={panelRefSetters[P_STAGE]}
          holderRef={holderRefSetters[P_STAGE]}
        >
          <Ask index={P_STAGE} />
          <div
            className={styles.options}
            role="group"
            aria-labelledby={`q-${P_STAGE}`}
          >
            {STAGES.map((o) => (
              <button
                key={o.id}
                type="button"
                className={styles.option}
                aria-pressed={stage === o.id}
                onClick={() => pickStage(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Panel>

        {/* ── 03 Need ─────────────────────────────────────── */}
        <Panel
          index={P_NEED}
          kind="question"
          active={at === P_NEED}
          locked={travelOn && at !== P_NEED}
          panelRef={panelRefSetters[P_NEED]}
          holderRef={holderRefSetters[P_NEED]}
        >
          <Ask index={P_NEED} />
          <div
            className={styles.options}
            role="group"
            aria-labelledby={`q-${P_NEED}`}
          >
            {NEEDS.map((o) => (
              <button
                key={o.id}
                type="button"
                className={styles.option}
                aria-pressed={need === o.id}
                onClick={() => pickNeed(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Panel>

        {/* ── 04 Budget ─────────────────────────────────────
            The switch is a mode, not an answer: throwing it and picking nothing
            still submits nothing for budget. Nothing here is pre-selected,
            because for a studio that disqualifies most of its inbound an
            unanswered question has to stay unanswered. */}
        <Panel
          index={P_BUDGET}
          kind="question"
          active={at === P_BUDGET}
          locked={travelOn && at !== P_BUDGET}
          panelRef={panelRefSetters[P_BUDGET]}
          holderRef={holderRefSetters[P_BUDGET]}
        >
          <Ask index={P_BUDGET} />
          <button
            type="button"
            role="switch"
            aria-checked={budgetMode === "one-time"}
            aria-label="Show one-time budgets instead of monthly"
            className={styles.switch}
            onClick={throwSwitch}
          >
            <span
              className={`${styles.switchSide} ${
                budgetMode === "monthly" ? styles.switchOn : ""
              }`}
            >
              Monthly
            </span>
            <span
              className={`${styles.switchSide} ${
                budgetMode === "one-time" ? styles.switchOn : ""
              }`}
            >
              One-time
            </span>
          </button>
          <div
            className={styles.options}
            role="group"
            aria-labelledby={`q-${P_BUDGET}`}
          >
            {bands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={styles.option}
                aria-pressed={band === b.id}
                onClick={() => pickBand(b.id)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </Panel>

        {/* ── 05 Anything else ──────────────────────────────
            The only place a visitor can say something the buttons cannot hold.
            One line, not a textarea: a textarea is an invitation to write, and
            typing is the enemy of a flow like this. */}
        <Panel
          index={P_NOTE}
          kind="question"
          active={at === P_NOTE}
          locked={travelOn && at !== P_NOTE}
          panelRef={panelRefSetters[P_NOTE]}
          holderRef={holderRefSetters[P_NOTE]}
        >
          <Ask index={P_NOTE} />
          <p className={styles.optional}>Optional</p>
          <input
            id="contact-note"
            aria-labelledby={`q-${P_NOTE}`}
            className={`${styles.input} ${styles.noteInput}`}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoComplete="off"
          />
          <div className={styles.foot}>
            <button type="submit" className={styles.next}>
              {note.trim().length > 0 ? "Next" : "Skip"}
            </button>
          </div>
        </Panel>

        {/* ── The review ────────────────────────────────────
            One question at a time means the visitor cannot see what they said,
            so the last screen says it back. Every row travels to the panel it
            came from, which is also the only way to change an answer. */}
        <Panel
          index={P_REVIEW}
          kind="review"
          active={at === P_REVIEW}
          locked={travelOn && at !== P_REVIEW}
          panelRef={panelRefSetters[P_REVIEW]}
          holderRef={holderRefSetters[P_REVIEW]}
        >
          <h2 className={styles.ask}>This is what we have.</h2>
          <ul className={styles.review}>
            {[
              { label: "Company", value: company.trim(), to: P_WHO },
              { label: "Email", value: email.trim(), to: P_WHO },
              {
                label: "Money",
                value: stage ? labelOf(STAGES, stage) : "",
                to: P_STAGE,
              },
              {
                label: "Need",
                value: need ? labelOf(NEEDS, need) : "",
                to: P_NEED,
              },
              {
                label: "Budget",
                value: band ? labelOf(bands, band) : "",
                to: P_BUDGET,
              },
              { label: "Note", value: note.trim(), to: P_NOTE },
            ].map((row) => (
              <li key={row.label}>
                <button
                  type="button"
                  className={styles.reviewRow}
                  onClick={() => goTo(row.to)}
                >
                  <span className={styles.reviewLabel}>{row.label}</span>
                  <span className={styles.reviewValue}>
                    {row.value || "Not answered"}
                  </span>
                  <span className={styles.reviewEdit} aria-hidden="true">
                    Change
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.foot}>
            <button type="submit" className={styles.send} disabled={sending}>
              <CtaSwap
                defaultLabel={sending ? "Sending…" : "Send"}
                hoverLabel="Let's go!"
              />
            </button>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>
        </Panel>

        {/* Off-screen rather than display:none, so a bot reading the computed
            style still finds a field it believes is fillable. Outside every
            panel, because the panels are inert and a bot has to be able to
            reach this one. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="contact-homepage">Homepage</label>
          <input
            id="contact-homepage"
            ref={honeypotRef}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </form>

      {/* The readout. Fixed to the viewport, outside the track the camera
          moves, because the travel needs one thing that does not travel or it
          reads as drift. */}
      <div className={styles.hud} data-hidden={at === P_STATEMENT || undefined}>
        <button
          type="button"
          className={styles.back}
          onClick={() => goTo(atRef.current - 1)}
          disabled={at === P_STATEMENT}
        >
          Back
        </button>
        {/* Only on the questions. The review is not the sixth of five, and a
            counter that has to lie about where it is is worse than no counter
            on the one screen that does not need one. */}
        {counted > 0 && (
          <p className={styles.count} aria-hidden="true">
            <span className={styles.countNow}>
              {String(counted).padStart(2, "0")}
            </span>
            <span className={styles.countOf}>/ 05</span>
          </p>
        )}
      </div>
    </section>
  );
}
