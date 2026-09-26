import { useEffect, useRef, useState } from "react";

/**
 * Reveal — premium scroll-reveal wrapper.
 * Rect-based viewport detection with three triggers so it works in every
 * environment (normal browsers, embedded webviews, stalled compositors):
 *   1. immediate check on mount
 *   2. scroll/resize listeners
 *   3. lightweight interval fallback (self-clears once revealed)
 * Optional gold shine sweep on the card while it reveals.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 36,
  once = true,
  shine = false,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const inView = () =>
      node.getBoundingClientRect().top < window.innerHeight * 0.94;

    const check = () => {
      if (doneRef.current) return;
      if (inView()) {
        doneRef.current = true;
        setVisible(true);
        clearInterval(intervalId);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };

    const intervalId = setInterval(check, 600);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    check(); // immediate first pass

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`tct-reveal ${visible ? "is-visible" : ""} ${shine ? "tct-reveal--shine" : ""} ${className}`}
      style={{
        "--reveal-delay": `${delay}ms`,
        "--reveal-y": `${y}px`,
      }}
    >
      {children}
    </Tag>
  );
}
