import { Link } from "react-router-dom";

export default function CtaBand() {
  return (
    <section className="tct-section tct-section--dark tct-cta-band">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <p className="tct-eyebrow">04 / Begin here</p>
            <h2 className="tct-section-title text-start">
              Your next chapter
              <br />
              <em>starts by hand.</em>
            </h2>
            <p className="tct-section-sub text-start">
              Ready to learn something that lasts? Tell us which craft is
              calling you.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/enquire" className="btn tct-btn-gold tct-btn-lg">
              Enquire About a Class
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
