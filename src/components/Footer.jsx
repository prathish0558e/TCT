import { Link } from "react-router-dom";

export default function Footer() {
  const socials = [
    {
      icon: "bi-instagram",
      label: "Instagram",
      href: "https://instagram.com/tct_fashion_hub?stkn=dmRicXg3bTZnaXJt",
    },
    {
      icon: "bi-facebook",
      label: "Facebook",
      href: "https://facebook.com/share/18dZzFyrWt",
    },
    {
      icon: "bi-youtube",
      label: "YouTube",
      href: "https://www.youtube.com/@TctFashionhub",
    },
    {
      icon: "bi-envelope-fill",
      label: "Email",
      href: "mailto:tctfashionhub@gmail.com",
    },
  ];

  return (
    <footer className="tct-footer">
      <div className="container">
        <div className="row g-4 py-5">
          <div className="col-md-4">
            <Link className="tct-brand tct-brand--footer" to="/">
              <img
                src="/images/Logo.jpeg"
                alt="TCT Fashion Hub logo"
                className="tct-brand__logo"
              />
              <span className="tct-brand__text">
                TCT Fashion <em>Hub</em>
              </span>
            </Link>
            <p className="tct-footer-tag">
              Where threads meet tradition — boutique craft classes in
              Coimbatore.
            </p>
            <div className="tct-social-links">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <h5>Explore</h5>
            <ul className="tct-footer-links list-unstyled">
              <li>
                <a href="/#classes">Single Classes</a>
              </li>
              <li>
                <a href="/#combos">Combo Classes</a>
              </li>
              <li>
                <Link to="/about">About the Studio</Link>
              </li>
              <li>
                <Link to="/enquire">Enquire</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Contact</h5>
            <ul className="tct-footer-links list-unstyled">
              <li>
                <i className="bi bi-telephone-fill me-2" />
                <a href="tel:+919384846922">+91 93848 46922</a>
              </li>
              <li>
                <i className="bi bi-envelope-fill me-2" />
                <a href="mailto:tctfashionhub@gmail.com">tctfashionhub@gmail.com</a>
              </li>
              <li>
                <i className="bi bi-geo-alt-fill me-2" />
                <a
                  href="https://maps.app.goo.gl/RSYcKT7v23LzfoiL7"
                  target="_blank"
                  rel="noreferrer"
                  className="tct-maps-link"
                >
                  No. 215, Second Floor, Shakthi Nagar, Near ICICI Bank Ganapathy,
                  Coimbatore — 641006
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="tct-footer-wordmark" aria-hidden="true">
          TCT FASHION HUB
        </div>
        <div className="tct-footer-bottom">
          <p>
            © {new Date().getFullYear()} TCT Fashion Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
