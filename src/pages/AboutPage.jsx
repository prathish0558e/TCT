export default function AboutPage() {
  const values = [
    ["bi-people", "Small batches", "Every student gets personal attention, every session."],
    ["bi-award", "Certified courses", "Finish with a certificate and a showcase of your work."],
    ["bi-gift", "Kit gifts included", "Every class begins with a starter kit, on the house."],
    ["bi-lightbulb", "Modern + traditional", "Time-honoured craft taught with contemporary flair."],
  ];

  const crafts = [
    "Tailoring",
    "Embroidery",
    "Aari Work",
    "Jewellery Making",
    "Saree Pre-Pleating",
    "Mehndi",
    "Resin Art",
  ];

  return (
    <>
      {/* Page hero */}
      <section className="tct-page-hero">
        <div className="container text-center">
          <img
            src="/images/Logo.jpeg"
            alt="TCT Fashion Hub logo"
            className="tct-page-hero__logo"
          />
          <p className="tct-eyebrow">Our story</p>
          <h1 className="tct-page-title">About TCT Fashion Hub</h1>
          <p className="tct-section-sub">
            Where threads meet tradition — a boutique craft studio in the heart
            of Coimbatore.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="tct-section pt-0">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <p className="tct-eyebrow">Since 2012</p>
              <h2 className="tct-section-title text-start">
                A Studio Built on Patient Hands
              </h2>
              <p className="tct-section-sub text-start">
                TCT Fashion Hub began as a small tailoring counter and grew
                into one of Coimbatore's most loved craft studios. We've trained
                hundreds of students — from their very first stitch to
                boutique-level aari and resin work. Our mentors keep batches
                small so every learner gets the attention they deserve, and
                every course includes materials to get you started the same
                day.
              </p>
              <p className="tct-section-sub text-start">
                Whether you want to stitch your own wardrobe, launch a home
                business, or simply rediscover the joy of making things by
                hand — there's a seat for you here.
              </p>
              <div className="row g-3 mt-4">
                {[
                  ["500+", "Students trained"],
                  ["7", "Crafts taught"],
                  ["12+", "Years of experience"],
                ].map(([num, label]) => (
                  <div className="col-4" key={label}>
                    <div className="tct-stat">
                      <strong>{num}</strong>
                      <span>{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="tct-about-panel">
                <blockquote className="tct-quote">
                  “The teachers make every technique feel effortless — I joined
                  for tailoring and stayed for aari work.”
                </blockquote>
                <p className="tct-quote-by">— Priya R., student since 2023</p>
                <div className="tct-about-panel__logo mt-4">
                  <img
                    src="/images/Logo.jpeg"
                    alt="TCT Fashion Hub emblem"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="tct-section tct-section--dark">
        <div className="container">
          <div className="text-center mb-5">
            <p className="tct-eyebrow">What we stand for</p>
            <h2 className="tct-section-title">The Studio Way</h2>
          </div>
          <div className="row g-4">
            {values.map(([icon, title, text]) => (
              <div className="col-sm-6 col-lg-3" key={title}>
                <div className="tct-value-card">
                  <i className={`bi ${icon}`} />
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crafts chips */}
      <section className="tct-section">
        <div className="container text-center">
          <p className="tct-eyebrow">Our crafts</p>
          <h2 className="tct-section-title">Seven Skills, One Studio</h2>
          <div className="tct-chips d-flex flex-wrap justify-content-center gap-2 mt-4">
            {crafts.map((c) => (
              <span className="tct-chip tct-chip--lg" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
