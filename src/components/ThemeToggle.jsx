import { useEffect, useState } from "react";

/**
 * ThemeToggle — moon/sun button in the navbar that flips the whole site
 * between the ivory (day) and night themes. The gold accents never change.
 *
 * Bonus: pressing "T" anywhere toggles the theme too.
 * The chosen theme is remembered in localStorage ("tct-theme").
 * NOTE: the class on <html> is applied by a tiny inline script in
 * index.html so the page never flashes the wrong theme on reload.
 */
export default function ThemeToggle() {
  const [night, setNight] = useState(() =>
    document.documentElement.classList.contains("tct-night")
  );

  // 'T' keyboard shortcut (ignore typing inside form fields)
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        apply(!document.documentElement.classList.contains("tct-night"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const apply = (toNight) => {
    document.documentElement.classList.toggle("tct-night", toNight);
    try {
      localStorage.setItem("tct-theme", toNight ? "night" : "ivory");
    } catch {
      /* private mode — ignore */
    }
    setNight(toNight);
  };

  return (
    <button
      type="button"
      className="tct-theme-toggle"
      onClick={() => apply(!night)}
      aria-pressed={night}
      title={night ? "Switch to ivory mode (T)" : "Switch to night mode (T)"}
      aria-label="Toggle night mode"
    >
      <span className="tct-theme-toggle__icon" aria-hidden="true">
        <i className={`bi ${night ? "bi-sun-fill" : "bi-moon-stars-fill"}`} />
      </span>
      <span className="tct-theme-toggle__stars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
