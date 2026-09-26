import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";

const BRAND = "TCT FASHION HUB".split("");

/**
 * Preloader — cinematic branded loading screen.
 * Letter-by-letter gold reveal, expanding gold line, shimmer,
 * progress bar and curtain-lift exit.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Progress is driven by REAL elapsed time, not tick counts — so even if
    // the browser throttles timers (background tab / slow machine), the
    // preloader always finishes smoothly and never gets stuck.
    const start = performance.now();
    const DURATION = 2100; // ms until 100%
    const tick = setInterval(() => {
      const value = Math.min(100, ((performance.now() - start) / DURATION) * 100);
      setProgress(Math.floor(value));
      if (value >= 100) {
        clearInterval(tick);
        // Cue the hero: curtain lifts AND the logo "launches" into the page,
        // while the hero logo makes its 3D arrival (body.tct-launched).
        setTimeout(() => {
          setLeaving(true);
          document.body.classList.add("tct-launched");
        }, 450);
        setTimeout(() => {
          setGone(true);
          document.body.style.overflow = "";
        }, 1250);
      }
    }, 120);

    return () => {
      clearInterval(tick);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`tct-preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Loading">
      <div className="tct-preloader__glow" aria-hidden="true" />
      <div className="tct-preloader__inner">
        <Reveal y={0}>
          <div className="tct-preloader__logo-wrap">
            <span className="tct-preloader__ring" aria-hidden="true" />
            <span className="tct-preloader__ring tct-preloader__ring--2" aria-hidden="true" />
            <img src="/images/Logo.jpeg" alt="TCT Fashion Hub" className="tct-preloader__logo" />
          </div>
        </Reveal>

        <h1 className="tct-preloader__word" aria-label="TCT Fashion Hub">
          {BRAND.map((ch, i) => (
            <span
              key={i}
              className="tct-preloader__letter"
              style={{ animationDelay: `${300 + i * 55}ms` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>

        <div className="tct-preloader__line" aria-hidden="true" />

        <Reveal delay={1150} y={8}>
          <p className="tct-preloader__tag">Where threads meet tradition</p>
        </Reveal>

        <div className="tct-preloader__bar">
          <div className="tct-preloader__bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="tct-preloader__pct">{progress}%</p>
      </div>
    </div>
  );
}
