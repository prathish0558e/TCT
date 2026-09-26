import { useState } from "react";
import PaymentOptions from "./PaymentOptions.jsx";

export default function SingleClasses({ classes }) {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <>
      <section id="classes" className="tct-section">
      <div className="container">
        <div className="text-center mb-5">
          <p className="tct-eyebrow">Learn a craft</p>
          <h2 className="tct-section-title">Single Classes</h2>
          <p className="tct-section-sub">
            Focused, mentor-led sessions — every enrolment comes with a{" "}
            <strong>Basic Kit gift</strong>.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {classes.map((c) => (
            <div className="col-sm-6 col-lg-4" key={c.id}>
              <article className="card tct-price-card h-100 tct-price-card--photo">
                <div className="tct-card-photo">
                  <img src={c.image} alt={c.name} loading="lazy" />
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <h3 className="tct-card-title">{c.name}</h3>
                    <span className="tct-chip">{c.level}</span>
                  </div>
                  <p className="tct-price">
                    <span className="tct-price__unit">Rs</span>
                    {c.price.toLocaleString("en-IN")}
                  </p>
                  <ul className="tct-meta list-unstyled">
                    <li>
                      <i className="bi bi-clock" /> {c.duration}
                    </li>
                    <li>
                      <i className="bi bi-gift" /> {c.gift}
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="btn tct-btn-gold mt-auto w-100"
                    onClick={() => setSelectedClass(c)}
                  >
                    <i className="bi bi-credit-card me-2" /> Pay Now
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
      </section>
      {selectedClass && (
        <PaymentOptions
          course={selectedClass.name}
          price={selectedClass.price}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </>
  );
}
