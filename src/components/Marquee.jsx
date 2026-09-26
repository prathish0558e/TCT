/**
 * Marquee — infinite scrolling ribbon with gold diamond separators.
 * Used between sections for a premium couture feel.
 */
export default function Marquee({ items, dark = false }) {
  const row = [...items, ...items, ...items];
  return (
    <div className={`tct-marquee ${dark ? "tct-marquee--dark" : ""}`} aria-hidden="true">
      <div className="tct-marquee__track">
        {row.map((item, i) => (
          <span className="tct-marquee__item" key={i}>
            {item}
            <span className="tct-marquee__diamond">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
