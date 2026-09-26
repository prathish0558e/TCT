import { useEffect, useRef, useState } from "react";

/**
 * Counter — animates a number from 0 to `value` when scrolled into view.
 * Rect-based detection so it works in every environment.
 */
export default function Counter({ value, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const run = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(Math.round(eased * value));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const intervalId = setInterval(() => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.95) {
        run();
        clearInterval(intervalId);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
