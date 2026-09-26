import { Link } from "react-router-dom";

export default function Footer() {
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
              Where threads meet tradition — boutique craft classes in the
              heart of Coimbatore.
            </p>
            <div className="tct-social-links" aria-label="TCT Fashion Hub social links">
              <a href="https://instagram.com/tct_fashion_hub?stkn=dmRicXg3bTZnaXJt" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="https://facebook.com/share/18dZzFyrWt" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>
              <a href="https://www.youtube.com/@TctFashionhub" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube" />
              </a>
              <a href="mailto:tctfashionhub@gmail.com" aria-label="Email TCT Fashion Hub">
                <i className="bi bi-envelope-fill" />
              </a>
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
              <li><a href="tel:+919384846922">+91 9384846922</a></li>
              <li><a href="https://wa.me/919384846922" target="_blank" rel="noreferrer">WhatsApp: +91 9384846922</a></li>
              <li><a href="mailto:tctfashionhub@gmail.com">tctfashionhub@gmail.com</a></li>
              <li>No. 215, Second Floor, Shakthi Nagar, Near ICICI Bank Ganapathy, Coimbatore - 641006.</li>
            </ul>
          </div>
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
