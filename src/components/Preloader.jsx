import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";

/**
 * Preloader — branded loading screen.
 * Logo with gold ring loader, brand name reveal, shimmer sweep,
 * progress bar and elegant curtain-lift exit.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    let value = 0;
    const tick = setInterval(() => {
      // ease towards 90 quickly, then crawl — feels "real"
      value += value < 70 ? Math.random() * 14 + 6 : Math.random() * 4 + 1;
      if (value >= 100) {
        value = 100;
        clearInterval(tick);
        setTimeout(() => setLeaving(true), 350);
        setTimeout(() => {
          setGone(true);
          document.body.style.overflow = "";
        }, 1150);
      }
      setProgress(Math.floor(value));
    }, 130);

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
            <img
              src="/images/Logo.jpeg"
              alt="TCT Fashion Hub"
              className="tct-preloader__logo"
            />
          </div>
        </Reveal>

        <Reveal delay={250} y={14}>
          <h1 className="tct-preloader__brand">
            TCT Fashion <em>Hub</em>
          </h1>
        </Reveal>

        <Reveal delay={420} y={10}>
          <p className="tct-preloader__tag">
            Where threads meet tradition
          </p>
        </Reveal>

        <div className="tct-preloader__bar">
          <div
            className="tct-preloader__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="tct-preloader__pct">{progress}%</p>
      </div>
    </div>
  );
}
