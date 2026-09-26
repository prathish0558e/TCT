import { useMemo } from "react";

/**
 * Starfield — magical night-mode sky inside the hero.
 * - 90 twinkling stars (opacity/size/drift staggered, pure CSS animation)
 * - 3 slow shooting stars streaking across the sky
 * Rendered ALWAYS, but only visible when <html> has .tct-night —
 * in ivory mode it quietly fades out, so day stays clean and bright.
 */
export default function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 82,
        size: Math.random() < 0.82 ? 1 + Math.random() * 1.4 : 2.4 + Math.random() * 1.6,
        delay: Math.random() * 7,
        duration: 2.6 + Math.random() * 4.4,
        drift: (Math.random() - 0.5) * 44,
      })),
    []
  );

  const shooters = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        top: 8 + Math.random() * 45,
        left: 55 + Math.random() * 40,
        delay: 4 + i * 9 + Math.random() * 4,
        duration: 2.6 + Math.random() * 1.6,
        angle: 22 + Math.random() * 14,
      })),
    []
  );

  return (
    <div className="tct-starfield" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className={s.size > 2.2 ? "tct-star tct-star--big" : "tct-star"}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            "--drift": `${s.drift}px`,
          }}
        />
      ))}
      {shooters.map((s) => (
        <span
          key={`sh-${s.id}`}
          className="tct-shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            "--angle": `${s.angle}deg`,
          }}
        />
      ))}
    </div>
  );
}
