import { useEffect, useState } from "react";
import SingleClasses from "../components/SingleClasses.jsx";
import ComboClasses from "../components/ComboClasses.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function HomePage() {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    // Python Flask service provides the pricing data through the Vite proxy
    fetch("/api/pricing")
      .then((r) => r.json())
      .then(setPricing)
      .catch(() =>
        setPricing({ singleClasses: [], comboClasses: [], studio: null })
      );
  }, []);

  return (
    <>
      <Hero />
      {pricing ? (
        <>
          <SingleClasses classes={pricing.singleClasses} />
          <ComboClasses combos={pricing.comboClasses} />
        </>
      ) : (
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status" style={{ color: "#b98a2f" }}>
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      )}
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <header id="home" className="tct-hero d-flex align-items-center">
      <div className="container position-relative">
        <div className="row align-items-center g-5">
          <div className="col-lg-8">
            <p className="tct-eyebrow">Ganapathy,Coimbatore · Since 2021</p>
            <h1 className="tct-hero-title">
              TCT Fashion <span>Hub</span>
            </h1>
            <p className="tct-hero-rule" aria-hidden="true">
              ✦
            </p>
            <p className="tct-hero-sub">
              Master the art of tailoring, embroidery, aari work, jewellery,
              mehndi, saree pre-pleating &amp; resin art — every class begins
              with a <strong>starter kit gift</strong> just for you.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <a href="#classes" className="btn tct-btn-gold tct-btn-lg">
                View Class Pricing
              </a>
              <a href="#combos" className="btn tct-btn-ghost tct-btn-lg">
                Explore Combos
              </a>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-block text-center">
            <div className="tct-hero-logo-frame">
              <img
                src="/images/Logo.jpeg"
                alt="TCT Fashion Hub logo"
                className="tct-hero-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
