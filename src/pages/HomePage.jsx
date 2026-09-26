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
    <header id="home" className="tct-hero">
      <img
        src="/images/Tct-front-background.jpeg"
        alt="TCT Fashion Hub - Learn, Create, Grow"
        className="tct-hero-banner"
      />
    </header>
  );
}
