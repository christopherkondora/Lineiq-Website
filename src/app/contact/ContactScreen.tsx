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
import styles from "./page.module.css";
import {
  buildContactLine,
  measureNodeLengths,
  type NodeLengths,
  type Pt,
} from "./contactLine";
import {
  BUDGET_BANDS,
  EMAIL_RE,
  HONEYPOT_FIELD,
  NEEDS,
  STAGES,
  type BudgetMode,
  type NeedId,
  type StageId,
} from "./intake";

// /contact, rebuilt again. The PRD is
// [[docs/website/2026-09-26-contact-qualify-flow]] in the vault; the short
// version of what this is:
//
// Five steps, two typed fields, three clicks, one optional line. Typing is the
// enemy — a contact form's worst failure is asking a stranger to write — so one
// step types and the rest are buttons, and every button is anchored on a hard
// filter of the ICP rather than on a service menu.
//
// The red line is the page's one gesture and the only progress indicator. It
// winds between the staggered steps and its head sits on the node the answers
// have earned. The camera rides the line's head: every frame of the head's
// travel the point is read off the path and the flow is translated so it lands
// on a fixed off-centre anchor, which is why the view pans sideways as it
// descends instead of sliding down like a scroll.
//
// Two things are deliberately separate, and they are allowed to disagree:
// the LINE measures answers, the CAMERA follows attention. A visitor tabbing
// back to re-read step 2 has moved their attention without un-answering
// anything.

/** Shape-accurate placeholders. The copy pass comes last and once, so it is
 *  frozen once and translated once. No em-dash anywhere: Voice v2, and this
 *  page is outward-facing. */
const HEADING = "Let's talk for real.";
const LEDE =
  "Three clients a year. Five questions, and you will know where you stand.";
const DIRECT_EMAIL = "hello@lineiqgroup.com";

const QUESTIONS = [
  "Who are you?",
  "Where's the money now?",
  "What do you need?",
  "What can you put behind it?",
  "Anything we should know?",
] as const;

/**
 * The stagger, as a fraction of `--stagger-base`.
 *
 * Not a regular zig-zag. An alternating pattern of equal amplitude reads as a
 * mechanical wave and the eye predicts it after the second gap; these four
 * values give every gap a different width, so the swing keeps arriving
 * slightly late. That is the difference between a path and a pattern.
 *
 * The sixth value is the submit row, which comes home to flush: the line
 * finishes where it started.
 */
const INDENTS = [0, 0.18, 0.06, 0.26, 0.1, 0] as const;

/** Index of the last node, the end of the stub under Send. */
const SEND_NODE = 5;

/** How many of the five steps have to be answered before Send is live. The
 *  fifth is optional, which is what makes it the fifth. */
const REQUIRED = 4;

type Answers = boolean[];

/**
 * An element's position relative to the section, in layout coordinates.
 *
 * getBoundingClientRect would be shorter and wrong twice over: the steps carry
 * a reveal transform until the arrival tween clears it, and the whole flow
 * carries the camera's transform for the rest of the page's life. A rect
 * includes both. offsetTop is pure layout and does not move, which is the only
 * reason the line and the camera cannot drift apart.
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

/** The first step still missing an answer, or the submit row if none is. */
function firstUnanswered(answers: Answers): number {
  const i = answers.findIndex((v) => !v);
  return i === -1 ? SEND_NODE : i;
}

/**
 * One step of the flow.
 *
 * Module level, not a closure inside the screen: a component declared inside
 * a render is a new type on every render, and React would unmount and remount
 * the subtree each keystroke, taking the caret with it.
 *
 * The inner wrapper is not decoration either. The arrival tween writes an
 * inline opacity on every [data-reveal] element, so the dim has to live
 * somewhere the tween does not reach. Nested opacities multiply and the two
 * states stay independent.
 */
function Step({
  index,
  attention,
  answered,
  innerRef,
  children,
}: {
  index: number;
  attention: number;
  answered: boolean;
  innerRef: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      className={`${styles.rv} ${styles.step}`}
      style={{ "--indent": INDENTS[index] } as CSSProperties}
      data-reveal
      data-node={index}
      data-attn={attention === index}
      data-answered={answered}
    >
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export default function ContactScreen() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<StageId | null>(null);
  const [need, setNeed] = useState<NeedId | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("monthly");
  const [band, setBand] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const [attention, setAttention] = useState(0);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const flowRef = useRef<HTMLFormElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** One stable setter per step. An inline arrow would be a new ref callback
   *  on every render, which React detaches and reattaches each time. */
  const stepRefSetters = useMemo(
    () =>
      QUESTIONS.map((_, i) => (el: HTMLDivElement | null) => {
        stepRefs.current[i] = el;
      }),
    []
  );
  const honeypotRef = useRef<HTMLInputElement>(null);

  /** When the form was mounted. The difference at submit time is the timing
   *  check: nothing a human fills in takes under three seconds. Stamped in an
   *  effect rather than during render, so it is a client clock reading and not
   *  a server one. */
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const answers: Answers = [
    company.trim().length > 0 && EMAIL_RE.test(email.trim()),
    stage !== null,
    need !== null,
    band !== null,
    note.trim().length > 0,
  ];

  // How far the line has earned. Counted, not measured as a leading run:
  // answering step 3 before step 2 should still move the line, and a flow that
  // is three quarters full showing no progress at all reads as broken rather
  // than as strict.
  //
  // Once all four required steps are in, the head runs past the optional fifth
  // to the end of the stub, which is what makes Send live.
  const doneCount = answers.slice(0, REQUIRED).filter(Boolean).length;
  const lineIndex = doneCount < REQUIRED ? doneCount : SEND_NODE;
  const complete = lineIndex === SEND_NODE;

  /** The tween reads these; nothing renders off them. */
  const nodesRef = useRef<NodeLengths | null>(null);
  const anchorRef = useRef<Pt>({ x: 0, y: 0 });
  const headRef = useRef({ len: 0 });
  const camRef = useRef<Pt>({ x: 0, y: 0 });
  const drawnRef = useRef(false);
  const cameraOnRef = useRef(false);
  const lineIndexRef = useRef(0);
  const attentionRef = useRef(0);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Attention is a ref and a state at once: the ref so the tweens created in
   *  this same tick read the value that was just set, the state so the dimming
   *  re-renders. */
  const setAttn = useCallback((i: number) => {
    attentionRef.current = i;
    setAttention(i);
  }, []);

  // ── The camera ────────────────────────────────────────────
  // One write, two elements, off whatever point it is handed. The SVG and the
  // flow move together, always by the same value in the same frame, so a node
  // cannot come off the step it was measured against.
  const applyCam = useCallback((x: number, y: number) => {
    const flow = flowRef.current;
    const svg = svgRef.current;
    if (!flow || !svg || !cameraOnRef.current) return;
    // Mutated, never replaced: the camera-only tween holds this exact object,
    // and swapping it for a fresh one each frame would leave killTweensOf
    // pointing at something nothing is tweening.
    camRef.current.x = x;
    camRef.current.y = y;
    const anchor = anchorRef.current;
    gsap.set([flow, svg], { x: anchor.x - x, y: anchor.y - y });
  }, []);

  const pointAtNode = useCallback((index: number): Pt | null => {
    const path = pathRef.current;
    const measured = nodesRef.current;
    if (!path || !measured) return null;
    const i = Math.min(Math.max(index, 0), measured.at.length - 1);
    const p = path.getPointAtLength(measured.at[i]);
    return { x: p.x, y: p.y };
  }, []);

  /** Rebuild the path against the current layout. Returns false if anything it
   *  needs is missing or the page is not laid out yet. */
  const remeasure = useCallback((): boolean => {
    const root = rootRef.current;
    const path = pathRef.current;
    const svg = svgRef.current;
    const flow = flowRef.current;
    const send = sendRef.current;
    if (!root || !path || !svg || !flow || !send) return false;
    if (root.offsetWidth < 2 || root.offsetHeight < 2) return false;

    // The gap is read off the stylesheet rather than repeated here, so the
    // breakpoint that changes it stays the single source of truth.
    const gap =
      parseFloat(
        getComputedStyle(root).getPropertyValue("--line-gap")
      ) || 30;
    // The same query the stylesheet uses, so the two cannot disagree about
    // which layout is on screen at the boundary.
    const wide = window.matchMedia("(min-width: 1024px)").matches;

    const steps: Pt[] = [];
    for (let i = 0; i < QUESTIONS.length; i++) {
      const el = stepRefs.current[i];
      if (!el) return false;
      const pos = layoutOffset(el, root);
      steps.push({ x: pos.x - gap, y: pos.y + el.offsetHeight / 2 });
    }

    const sendPos = layoutOffset(send, root);
    const plan = buildContactLine(
      steps,
      { x: sendPos.x - gap, y: sendPos.y + send.offsetHeight / 2 },
      sendPos.y + send.offsetHeight + 8,
      sendPos.x + send.offsetWidth,
      wide
    );

    // The SVG has to cover the flow, not the stage: with the camera on the
    // stage is exactly one viewport and the flow is taller than it, and an SVG
    // clipped to the stage would cut the path off at the fold.
    const flowPos = layoutOffset(flow, root);
    const w = root.offsetWidth;
    const h = Math.max(root.offsetHeight, flowPos.y + flow.offsetHeight + 120);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    path.setAttribute("d", plan.d);

    const measured = measureNodeLengths(path, plan.nodes);
    if (!measured.total) return false;
    nodesRef.current = measured;
    // The gap is twice the dash so no wrap of the pattern can leave a tail
    // showing at the end of the path while the head is still on its way.
    path.style.strokeDasharray = `${measured.total} ${measured.total * 2}`;

    // The anchor is the line's own rest position, read rather than declared:
    // 46% of the viewport's height, and the x the first node is laid out at.
    // Nothing repeats the 38% from the PRD as a number in two places — the
    // stylesheet puts the first node there and the camera takes it from the
    // measurement, so the two cannot drift.
    anchorRef.current = { x: plan.nodes[0].x, y: root.offsetHeight * 0.46 };
    return true;
  }, []);

  /** Put the head where the answers have earned, and carry the camera with it
   *  when the visitor's attention is on the same node. */
  const runHead = useCallback(
    (immediate: boolean) => {
      const path = pathRef.current;
      const measured = nodesRef.current;
      if (!path || !measured) return;

      const i = Math.min(lineIndexRef.current, measured.at.length - 1);
      const target = measured.at[i];
      const head = headRef.current;

      const write = () => {
        path.style.strokeDashoffset = String(measured.total - head.len);
        // The camera is written from the head's own tween, off the same value,
        // in the same frame. Not a second tween with a matching duration: two
        // tweens desync under a dropped frame or a mid-flight retarget, and a
        // camera lagging its own line by 40ms looks broken in a way nobody can
        // name.
        if (cameraOnRef.current && attentionRef.current === lineIndexRef.current) {
          const p = path.getPointAtLength(head.len);
          applyCam(p.x, p.y);
        }
      };

      // Whatever the camera was doing on its own, the head takes over from
      // here if the two agree. Without this, a camera tween still in flight
      // from a tab press would keep writing the transform underneath the
      // head's own writes, and the two would fight for a frame or two.
      if (attentionRef.current === lineIndexRef.current) {
        gsap.killTweensOf(camRef.current);
      }

      if (immediate || reduced()) {
        gsap.killTweensOf(head);
        head.len = target;
        write();
        return;
      }

      gsap.to(head, {
        len: target,
        // The head has to leave and arrive. An out-ease starts at full speed,
        // which on a curved path reads as a snap followed by a glide: the one
        // place on the site where the ease-in matters more than the ease-out.
        duration: 0.9,
        ease: "power2.inOut",
        overwrite: "auto",
        onUpdate: write,
      });
    },
    [applyCam]
  );

  /** The camera alone, when attention has moved somewhere the line has not. */
  const runCamera = useCallback(
    (index: number, immediate: boolean) => {
      if (!cameraOnRef.current) return;
      const pt = pointAtNode(index);
      if (!pt) return;
      const cam = camRef.current;
      if (immediate || reduced()) {
        gsap.killTweensOf(cam);
        applyCam(pt.x, pt.y);
        return;
      }
      gsap.to(cam, {
        x: pt.x,
        y: pt.y,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => applyCam(cam.x, cam.y),
      });
    },
    [applyCam, pointAtNode]
  );

  // Whether the camera runs at all. Refused under 1024px, where the flow
  // stacks and the page scrolls, and refused outright under reduced motion.
  // The static stack is the base state; this is added to it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const on = wide.matches && !motion.matches;
      cameraOnRef.current = on;
      setCameraOn(on);
      if (!on && flowRef.current && svgRef.current) {
        gsap.set([flowRef.current, svgRef.current], { clearProps: "transform" });
      }
    };
    sync();
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
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
    const flow = flowRef.current;
    const path = pathRef.current;
    if (!root || !flow || !path) return;

    let cancelled = false;

    const start = () => {
      if (cancelled || drawnRef.current) return;
      if (!remeasure()) return;
      const measured = nodesRef.current;
      if (!measured) return;
      drawnRef.current = true;

      // The camera sits at rest for the entry rather than riding it. The line
      // starts 150px above and 54px to the side of the first node, so a camera
      // slaved to the draw would carry the whole flow in from down and to the
      // left on top of the reveal already bringing it up: two arrivals for one
      // page. The camera's job starts with the first answer.
      const rest = pointAtNode(0);
      if (rest) applyCam(rest.x, rest.y);

      const head = headRef.current;
      if (reduced()) {
        head.len = measured.at[0];
        path.style.strokeDashoffset = String(measured.total - head.len);
        return;
      }
      gsap.fromTo(
        head,
        { len: 0 },
        {
          len: measured.at[0],
          duration: 1.8,
          delay: 0.15,
          ease: "power3.inOut",
          onUpdate: () => {
            path.style.strokeDashoffset = String(measured.total - head.len);
          },
        }
      );
    };

    void (document.fonts?.ready ?? Promise.resolve()).then(start);
    // Fallback for the case where the font promise never settles.
    const t = window.setTimeout(start, 1200);

    // Rebuilding keeps the nodes on the steps through a resize, a late font,
    // and anything else that moves the column. The dash pattern, the offset and
    // the camera are all rewritten from the new measurement in the same frame,
    // so nothing redraws and nothing jumps.
    const ro = new ResizeObserver(() => {
      if (!drawnRef.current || !remeasure()) return;
      runHead(!gsap.isTweening(headRef.current));
      if (!gsap.isTweening(headRef.current)) {
        runCamera(attentionRef.current, true);
      }
    });
    ro.observe(root);
    ro.observe(flow);

    const head = headRef.current;
    const cam = camRef.current;
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      ro.disconnect();
      gsap.killTweensOf(head);
      gsap.killTweensOf(cam);
    };
  }, [applyCam, pointAtNode, remeasure, runCamera, runHead]);

  // Every answer moves the head. Both directions: clearing one pulls the line
  // back, because a progress indicator that only ever advances is decoration.
  useEffect(() => {
    lineIndexRef.current = lineIndex;
    if (!drawnRef.current || done) return;
    runHead(false);
  }, [lineIndex, done, runHead]);

  // The camera, when the line is not already carrying it. Declared after the
  // line's effect so that on an answer the head tween exists by the time this
  // runs and can be left to do the work.
  useEffect(() => {
    if (!drawnRef.current || done || !cameraOnRef.current) return;
    if (attention === lineIndex && gsap.isTweening(headRef.current)) return;
    runCamera(attention, false);
  }, [attention, lineIndex, done, runCamera]);

  // Attention, written by the browser rather than by us: Tab, Shift+Tab, a
  // label click, autofill, a password manager, and the focus the browser moves
  // after a failed submit all land here. A camera wired only to clicks misses
  // every one of them and the visitor ends up typing into something off
  // screen, silently.
  useEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const onFocusIn = (e: FocusEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-node]"
      );
      if (!el) return;
      const i = Number(el.dataset.node);
      if (!Number.isNaN(i)) setAttn(i);
    };
    flow.addEventListener("focusin", onFocusIn);
    return () => flow.removeEventListener("focusin", onFocusIn);
  }, [setAttn]);

  // On submit the flow leaves and the confirmation takes its place, so every
  // step the path was measured against is gone. The line finishes its run and
  // then goes with them rather than hanging over new content it does not fit.
  useEffect(() => {
    if (!done) return;
    const path = pathRef.current;
    if (!path) return;
    gsap.killTweensOf(headRef.current);
    gsap.killTweensOf(camRef.current);
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
        // transform re-exposes the one the reveal class sets, so the elements
        // settle 30px below where they were laid out. Invisible on a page
        // where everything shifts together; fatal here, where the line is
        // drawn from layout coordinates and the two have to agree.
      });
    }, root);
    return () => ctx.revert();
  }, []);

  /**
   * A button answer, committed.
   *
   * Clicking advances attention as well as the line, and that is not a
   * convenience: clicking a <button> does not move focus in WebKit, and steps
   * two, three and four are nothing but buttons. Wired to focusin alone, the
   * primary path through this flow — a visitor clicking with a mouse — would
   * fire no focus event at all on Safari, the line would advance and the
   * camera would sit still.
   *
   * Typing does not commit. Step one's answer lands the moment both fields are
   * valid, which can be mid-word, and a camera that pulls away from the field
   * being typed in is worse than no camera.
   */
  const commit = (index: number, next: Answers) => {
    if (error) setError("");
    const from = next.slice();
    from[index] = true;
    setAttn(firstUnanswered(from));
  };

  const answersWith = (index: number, value: boolean): Answers => {
    const a = answers.slice();
    a[index] = value;
    return a;
  };

  const pickStage = (id: StageId) => {
    setStage(id);
    commit(1, answersWith(1, true));
  };

  const pickNeed = (id: NeedId) => {
    setNeed(id);
    commit(2, answersWith(2, true));
  };

  const pickBand = (id: string) => {
    setBand(id);
    commit(3, answersWith(3, true));
  };

  /** Throwing the switch changes which four labels are on screen and nothing
   *  else. It clears the band because a monthly id is not a one-time answer,
   *  and the line retreats, which is honest. */
  const throwSwitch = () => {
    setBudgetMode((m) => (m === "monthly" ? "one-time" : "monthly"));
    setBand(null);
  };

  const focusStep = (index: number) => {
    const el = stepRefs.current[index];
    const control = el?.querySelector<HTMLElement>("input, button");
    control?.focus();
    setAttn(index);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!answers[0]) {
      setError(
        company.trim().length === 0
          ? "We need the company name, so we know who we are looking at."
          : "We need a valid email address, so we have somewhere to reply."
      );
      focusStep(0);
      return;
    }
    const missing = answers.slice(0, REQUIRED).findIndex((v) => !v);
    if (missing !== -1) {
      setError("One more answer and we have something to work with.");
      focusStep(missing);
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

  return (
    <section
      ref={rootRef}
      className={styles.stage}
      data-camera={cameraOn && !done ? "on" : undefined}
    >
      <svg
        ref={svgRef}
        className={styles.line}
        aria-hidden="true"
        focusable="false"
      >
        {/* The hidden start state is CSS, so nothing is painted between first
            paint and hydration. The real dash pattern arrives with the first
            measurement. */}
        <path ref={pathRef} className={styles.linePath} fill="none" />
      </svg>

      <div className={styles.inner}>
        <div className={styles.statement}>
          <h1 className={`${styles.rv} ${styles.title}`} data-reveal>
            {HEADING}
          </h1>
          <p className={`${styles.rv} ${styles.lede}`} data-reveal>
            {LEDE}
          </p>
          <a
            className={`${styles.rv} ${styles.direct}`}
            data-reveal
            href={`mailto:${DIRECT_EMAIL}`}
          >
            {DIRECT_EMAIL}
          </a>
        </div>

        {/* The form stays mounted while sending, and is replaced only once the
            submission is accepted.

            noValidate is deliberate: the fields keep their `required` for
            assistive tech, but the browser's own bubbles would fire before
            onSubmit and say it in a voice that is not ours. */}
        {!done && (
          <form
            ref={flowRef}
            onSubmit={onSubmit}
            className={styles.flow}
            noValidate
          >
            {/* Step 1 — Who. Two fields. The person's name is not here and that
                was a ruling, not an oversight: the reply template has to work
                without one. */}
            <Step
              index={0}
              attention={attention}
              answered={answers[0]}
              innerRef={stepRefSetters[0]}
            >
              <p className={styles.stepQ} id="q-who">
                {QUESTIONS[0]}
              </p>
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
            </Step>

            {/* Step 2 — hard filter 1. "Not selling yet" is an automatic no and
                the form does not say so: a form that disqualifies a visitor to
                their face on the studio's only conversion surface is a worse
                thing than a reply two days later. */}
            <Step
              index={1}
              attention={attention}
              answered={answers[1]}
              innerRef={stepRefSetters[1]}
            >
              <p className={styles.stepQ} id="q-stage">
                {QUESTIONS[1]}
              </p>
              <div className={styles.options} role="group" aria-labelledby="q-stage">
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
            </Step>

            {/* Step 3 — service fit. */}
            <Step
              index={2}
              attention={attention}
              answered={answers[2]}
              innerRef={stepRefSetters[2]}
            >
              <p className={styles.stepQ} id="q-need">
                {QUESTIONS[2]}
              </p>
              <div className={styles.options} role="group" aria-labelledby="q-need">
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
            </Step>

            {/* Step 4 — ability to pay. The switch is one tab stop and it is
                not an answer: it is a mode, and selecting no band still
                submits nothing for budget. Nothing else here is
                pre-selected — for a studio that disqualifies most of its
                inbound, an unanswered step has to stay unanswered. */}
            <Step
              index={3}
              attention={attention}
              answered={answers[3]}
              innerRef={stepRefSetters[3]}
            >
              <p className={styles.stepQ} id="q-budget">
                {QUESTIONS[3]}
              </p>
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
              <div className={styles.bands} role="group" aria-labelledby="q-budget">
                {bands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`${styles.option} ${styles.band}`}
                    aria-pressed={band === b.id}
                    onClick={() => pickBand(b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Step>

            {/* Step 5 — the only place a visitor can say something the buttons
                cannot hold. A single-line input, not a textarea: a textarea is
                an invitation to write, and typing is the enemy. */}
            <Step
              index={4}
              attention={attention}
              answered={answers[4]}
              innerRef={stepRefSetters[4]}
            >
              <p className={styles.stepQ}>
                <label htmlFor="contact-note">{QUESTIONS[4]}</label>
                <span className={styles.optional}>Optional</span>
              </p>
              <input
                id="contact-note"
                className={styles.input}
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                autoComplete="off"
              />
            </Step>

            {/* Not display:none, so a bot reading the computed style still
                finds a field it believes is fillable. Uncontrolled, because
                nothing in React should ever care what a bot typed. */}
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

            <div
              className={`${styles.rv} ${styles.sendRow}`}
              data-reveal
              data-node={SEND_NODE}
              style={{ "--indent": INDENTS[SEND_NODE] } as CSSProperties}
            >
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
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
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
                  We will read your answers against your market, and arrive at
                  the first call already having something to say.
                </p>
              </div>
              <div>
                <p className="text-label">Response time</p>
                <p className={styles.doneText}>
                  You will hear back by email within 48 hours on business days.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
