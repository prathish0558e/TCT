import { useRef } from "react";

/**
 * TiltCard — subtle 3D tilt + moving glare on hover.
 * Wraps children in a perspective container; pure CSS transforms.
 */
export default function TiltCard({ children, max = 7, className = "" }) {
  const innerRef = useRef(null);
  const wrapRef = useRef(null);

  const onMove = (e) => {
    const card = innerRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
    card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const card = innerRef.current;
    if (card) card.style.transform = "";
  };

  return (
    <div
      ref={wrapRef}
      className={`tct-tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="tct-tilt__inner" ref={innerRef}>
        {children}
        <span className="tct-tilt__glare" aria-hidden="true" />
      </div>
    </div>
  );
}
