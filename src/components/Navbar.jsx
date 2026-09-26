import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Home", "/"],
    ["About", "/about"],
    ["Enquire", "/enquire"],
  ];

  const homeAnchor = (hash, label) => (
    <a
      className="nav-link tct-nav-link"
      href={`/${hash}`}
      onClick={() => setOpen(false)}
    >
      {label}
    </a>
  );

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top tct-navbar ${scrolled ? "tct-navbar--scrolled" : ""}`}
    >
      <div className="container">
        <Link
          className="navbar-brand tct-brand"
          to="/"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/Logo.jpeg"
            alt="TCT Fashion Hub logo"
            className="tct-brand__logo"
          />
          <span className="tct-brand__text">
            TCT Fashion <em>Hub</em>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {links.map(([label, to]) => (
              <li className="nav-item" key={to}>
                {to === "/" ? (
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link tct-nav-link ${isActive ? "active" : ""}`
                    }
                    to="/"
                    end
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </NavLink>
                ) : (
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link tct-nav-link ${isActive ? "active" : ""}`
                    }
                    to={to}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </NavLink>
                )}
              </li>
            ))}
            <li className="nav-item" onClick={() => setOpen(false)}>
              {homeAnchor("#classes", "Single Classes")}
            </li>
            <li className="nav-item" onClick={() => setOpen(false)}>
              {homeAnchor("#combos", "Combos")}
            </li>
            <li className="nav-item ms-lg-3">
              <Link to="/enquire" className="btn tct-btn-gold tct-btn-sm-nav">
                Enquire Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
