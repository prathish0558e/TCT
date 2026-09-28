import { useState } from "react";
import PaymentOptions from "./PaymentOptions.jsx";
import ClassInfoModal from "./ClassInfoModal.jsx";
import Reveal from "./Reveal.jsx";
import TiltCard from "./TiltCard.jsx";

const INDIVIDUAL_PRICES = {
  "Tailoring Class": 8000,
  "Embroidery Class": 7000,
  "Jewellery Making": 6000,
  "Saree Pre-Pleating": 2000,
  "Mehndi Class": 4000,
  "Aari Work Class": 7000,
};

export default function ComboClasses({ combos }) {
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [infoCombo, setInfoCombo] = useState(null);

  const savingsFor = (combo) => {
    const sum = combo.items.reduce(
      (acc, item) => acc + (INDIVIDUAL_PRICES[item] || 0),
      0
    );
    return sum > 0 ? sum - combo.total : null;
  };

  return (
    <>
      <section id="combos" className="tct-section tct-section--dark">
        <div className="container">
          <Reveal className="text-center mb-5">
            <p className="tct-eyebrow">Save more, learn more</p>
            <h2 className="tct-section-title">Combo Classes</h2>
            <p className="tct-section-sub">
              Curated bundles at special prices — bigger kits, bigger savings.
            </p>
          </Reveal>

          <div className="row g-4 justify-content-center">
            {combos.map((combo, i) => {
              const save = savingsFor(combo);
              return (
                <div
                  className={combo.featured ? "col-lg-7" : "col-md-6 col-lg-5"}
                  key={combo.id}
                >
                  <Reveal delay={i * 90} shine className="h-100">
                    <TiltCard className="h-100">
                      <article
                        className={`card h-100 tct-card-clickable ${
                          combo.featured
                            ? "tct-combo-featured"
                            : "tct-price-card"
                        }`}
                        onClick={() => setInfoCombo(combo)}
                      >
                        {combo.badge && (
                          <span className="tct-badge">{combo.badge}</span>
                        )}
                        <div className="tct-card-photo">
                          <img
                            src={combo.image}
                            alt={combo.name}
                            onError={(e) => {
                              if (!e.currentTarget.dataset.fallback) {
                                e.currentTarget.dataset.fallback = "1";
                                e.currentTarget.src = "/images/placeholder.svg";
                              }
                            }}
                          />
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h3 className="tct-card-title">{combo.name}</h3>
                          <p className="tct-price">
                            <span className="tct-price__unit">Rs</span>
                            {combo.total.toLocaleString("en-IN")}
                          </p>
                          {save !== null && save > 0 && (
                            <p className="tct-save-note">
                              <i className="bi bi-tag-fill" /> You save Rs{" "}
                              {save.toLocaleString("en-IN")}
                            </p>
                          )}
                          <ul className="tct-combo-list list-unstyled">
                            {combo.items.map((item) => (
                              <li key={item}>
                                <i className="bi bi-check2" /> {item}
                              </li>
                            ))}
                          </ul>
                          <p className="tct-gift-note">
                            <i className="bi bi-gift-fill" /> {combo.gift}
                          </p>
                          <span className="tct-view-hint">
                            <i className="bi bi-arrows-fullscreen" /> View details
                          </span>
                          <button
                            type="button"
                            className={`btn tct-btn-shine mt-auto w-100 ${
                              combo.featured
                                ? "tct-btn-gold"
                                : "tct-btn-outline-gold"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCombo(combo);
                            }}
                          >
                            <i className="bi bi-credit-card me-2" /> Pay Now
                          </button>
                        </div>
                      </article>
                    </TiltCard>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {infoCombo && (
        <ClassInfoModal
          item={infoCombo}
          onClose={() => setInfoCombo(null)}
          onPay={() => {
            setInfoCombo(null);
            setSelectedCombo(infoCombo);
          }}
        />
      )}
      {selectedCombo && (
        <PaymentOptions
          course={selectedCombo.name}
          price={selectedCombo.total}
          onClose={() => setSelectedCombo(null)}
        />
      )}
    </>
  );
}
