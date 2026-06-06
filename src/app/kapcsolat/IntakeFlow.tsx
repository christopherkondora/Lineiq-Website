"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import CtaSwap from "../components/CtaSwap";
import styles from "./page.module.css";
import { services } from "../data/services";

// Kurált intake folyamat — egy kérdés egy képernyő, minden középre rendezve,
// a teljes oldal egyetlen viewport. A cégnév az egyetlen kötelező mező (plusz
// az email, hogy legyen hova válaszolni), a többi lépés kihagyható.
// A mezőkészlet Áronnal véglegesítés alatt, a struktúra már él.

const SERVICE_OPTIONS = services.map((s) => s.title);

// Csúszka-skála: balról jobbra növekvő keret, a középső a kiindulópont.
const BUDGET_OPTIONS = ["1 M Ft alatt", "1–5 M Ft", "5 M Ft felett"];

const QUESTIONS = [
  "Melyik cégről van szó?",
  "Mire van szükségetek?",
  "Mekkora kerettel terveztek?",
  "Kihez szóljon a válasz?",
];

const STEP_COUNT = QUESTIONS.length;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function IntakeFlow() {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  // A cím egyszer, betöltéskor emelkedik fel — a .reveal osztály tartja a
  // rejtett kezdőállapotot, reduced motion esetén a CSS oldja fel.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-hero]"), {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        delay: 0.15,
        ease: "power3.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Lépésváltáskor a friss kérdés alulról úszik be.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stepRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el.querySelectorAll("[data-reveal]"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }
    );
    return () => {
      tween.kill();
    };
  }, [step, done]);

  const goTo = (next: number) => {
    setError("");
    setStep(next);
  };

  // Minden kérdés kötelező — lépni csak kitöltve lehet.
  const advance = () => {
    if (step === 0 && !company.trim()) {
      setError("Cégnév nélkül nem tudunk felkészülni.");
      return;
    }
    if (step === 1 && picked.length === 0) {
      setError("Válassz legalább egy területet.");
      return;
    }
    goTo(step + 1);
  };

  const toggleService = (title: string) => {
    setPicked((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const submit = async () => {
    if (!name.trim()) {
      setError("A neved is kell — tudnunk kell, kinek válaszolunk.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Érvényes email cím kell, hogy legyen hova válaszolnunk.");
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
          services: picked,
          budget,
          name: name.trim(),
          email: email.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "A beküldés nem sikerült, próbáld újra.");
        return;
      }
      setDone(true);
    } catch {
      setError("A beküldés nem sikerült, próbáld újra.");
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (step < STEP_COUNT - 1) advance();
    else void submit();
  };

  return (
    <section ref={rootRef} className={styles.screen}>
      <div className={`container ${styles.inner}`}>
        {/* A stage a cím szélességére húzódik össze — a vissza-nyíl így a
            cím bal éléhez igazodhat pozicionálással, mérés nélkül. */}
        <div className={styles.stage}>
        <header className={styles.head}>
          <h1 className={`reveal ${styles.title}`} data-hero>
            Beszéljünk komolyan.
          </h1>
        </header>

        <div className={styles.flowArea} ref={stepRef}>
          {done ? (
            <>
              <h2 className={styles.doneTitle} data-reveal>
                Megvan.
              </h2>
              <p className={styles.doneSignature} data-reveal aria-hidden="true">
                talk soon.
              </p>
              <div className={styles.doneGrid} data-reveal>
                <div>
                  <p className="text-label">Következő lépés</p>
                  <p className={styles.doneText}>
                    Átnézzük a cégedet és a piacodat, és úgy érkezünk az első
                    hívásra, hogy már van miről beszélnünk.
                  </p>
                </div>
                <div>
                  <p className="text-label">Válaszidő</p>
                  <p className={styles.doneText}>
                    Munkanapokon 48 órán belül jelentkezünk emailben.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={onSubmit} className={styles.form}>
              <div
                className={styles.ticks}
                data-reveal
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={STEP_COUNT}
                aria-valuenow={step + 1}
                aria-label="Lépések"
              >
                {Array.from({ length: STEP_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.tick} ${i <= step ? styles.tickActive : ""}`}
                  />
                ))}
              </div>

              <div className={styles.questionRow} data-reveal>
                {step > 0 && (
                  <button
                    type="button"
                    className={styles.backArrow}
                    onClick={() => goTo(step - 1)}
                    aria-label="Vissza"
                  >
                    {/* Custom Fraunces nyíl — az "l" betű talpából rajzolt jel. */}
                    <svg viewBox="0 0 85 32" fill="none" aria-hidden="true">
                      <path
                        d="M83.7557 23.7904L16.2876 23.7904C15.778 23.7904 14.2867 23.8372 14 24C13.7133 24.1953 14.5993 24.5392 14.4719 24.9624L13.5256 31.3652C13.4937 31.5931 13.43 31.7558 13.3345 31.8535C13.2389 31.9512 13.1274 32 13 32C12.8407 32 12.7133 31.9349 12.6177 31.8047C12.554 31.707 0 16.6637 0 15.6465C0 14.6292 12.7196 0.325549 12.7833 0.195329C12.8788 0.0651097 13.0063 0 13.1655 0C13.2929 0 13.4044 0.0488324 13.5 0.146497C13.5956 0.276716 13.6752 0.472045 13.7389 0.732484L14.4719 7.77343C14.5993 8.19664 13.7133 8.83723 14 9C14.2867 9.19533 15.762 8.9454 16.2399 8.9454L78.0219 8.9454C78.3086 8.9454 78.5156 8.88029 78.643 8.75007C78.7705 8.65241 78.8342 8.45708 78.8342 8.16408L78.8819 5.67364C78.8819 5.44575 78.9297 5.28298 79.0253 5.18532C79.1209 5.12021 79.2323 5.08765 79.3598 5.08765C79.519 5.08765 79.6305 5.13648 79.6942 5.23415C79.7898 5.33181 79.8694 5.47831 79.9331 5.67364L84.2813 21.4953C84.4087 21.9185 84.4884 22.2115 84.5202 22.3743C84.5521 22.5696 84.568 22.7649 84.568 22.9603C84.568 23.2533 84.4884 23.4649 84.3291 23.5951C84.2017 23.7253 84.0105 23.7904 83.7557 23.7904Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                )}
                <h2 className={styles.question}>{QUESTIONS[step]}</h2>
              </div>

              {step === 0 && (
                <div className={styles.inputWrap} data-reveal>
                  <input
                    className={styles.input}
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Cégnév"
                    autoComplete="organization"
                    aria-required="true"
                    autoFocus
                  />
                </div>
              )}

              {step === 1 && (
                <div className={styles.options} data-reveal>
                  {SERVICE_OPTIONS.map((title) => (
                    <button
                      key={title}
                      type="button"
                      className={`${styles.option} ${picked.includes(title) ? styles.optionActive : ""}`}
                      onClick={() => toggleService(title)}
                      aria-pressed={picked.includes(title)}
                    >
                      <span className={styles.checkbox} aria-hidden="true">
                        <svg viewBox="0 0 12 10" fill="none">
                          <path
                            className={styles.checkmark}
                            d="M1.5 5.2 4.4 8 10.5 1.8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {title}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <>
                  <div className={styles.sliderWrap} data-reveal>
                    <input
                      type="range"
                      className={styles.slider}
                      min={0}
                      max={BUDGET_OPTIONS.length - 1}
                      step={1}
                      value={BUDGET_OPTIONS.indexOf(budget)}
                      onChange={(e) =>
                        setBudget(BUDGET_OPTIONS[Number(e.target.value)])
                      }
                      aria-label="Keret"
                      aria-valuetext={budget}
                    />
                    {/* A natív thumb rejtve van — ez a kör mozog helyette,
                        CSS transitionnel simítva. */}
                    <span
                      className={styles.sliderThumb}
                      style={{
                        left: `${(BUDGET_OPTIONS.indexOf(budget) / (BUDGET_OPTIONS.length - 1)) * 100}%`,
                      }}
                      aria-hidden="true"
                    />
                    {BUDGET_OPTIONS.map((b, i) => (
                      <button
                        key={b}
                        type="button"
                        className={`${styles.sliderLabel} ${budget === b ? styles.sliderLabelActive : ""}`}
                        style={{
                          left: `${(i / (BUDGET_OPTIONS.length - 1)) * 100}%`,
                        }}
                        onClick={() => setBudget(b)}
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className={styles.fields} data-reveal>
                    <input
                      className={styles.input}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Neved"
                      autoComplete="name"
                      aria-required="true"
                    />
                    <input
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email címed"
                      autoComplete="email"
                      aria-required="true"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <div className={styles.actions} data-reveal>
                <button
                  type="submit"
                  className={styles.nextBtn}
                  disabled={sending}
                >
                  {step < STEP_COUNT - 1 ? (
                    <CtaSwap defaultLabel="Tovább" hoverLabel="Tovább" />
                  ) : (
                    <CtaSwap
                      defaultLabel={sending ? "Küldés…" : "Beküldöm"}
                      hoverLabel="Mehet!"
                    />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
