import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Confetti from "../components/Confetti.jsx";
import ClassSelect from "../components/ClassSelect.jsx";

const WHATSAPP_NUMBER = "919384846922";

const whatsappEnquiryLink = (form) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello TCT Fashion Hub,\n\nNew class enquiry\nName: ${form.name}\nPhone: ${form.phone}\nInterested in: ${form.interest}\nMessage: ${form.message || "Not provided"}`
  )}`;

export default function EnquirePage() {
  const [params] = useSearchParams();
  const prefill = params.get("class") || "";
  const prefillDisplay = prefill || "your class";
  const paymentPrice = params.get("price");
  const isPayment = params.get("action") === "payment";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: prefill,
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [burst, setBurst] = useState(0);
  const [classError, setClassError] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "interest" && e.target.value) setClassError(false);
  };

  // Keep the selected class in sync when ?class= changes
  useEffect(() => {
    const q = params.get("class");
    if (q) setForm((f) => ({ ...f, interest: q }));
  }, [params]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.interest) {
      setClassError(true);
      setShakeCount((c) => c + 1); // replay the shake on the select
      return;
    }
    setStatus("sending");
    window.open(whatsappEnquiryLink(form), "_blank", "noopener,noreferrer");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setBurst((b) => b + 1); // fire the golden celebration
      setForm({ name: "", phone: "", email: "", interest: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Confetti fireKey={burst} />
      <section className="tct-page-hero">
        <div className="container text-center">
          <img
            src="/images/Logo.jpeg"
            alt="TCT Fashion Hub logo"
            className="tct-page-hero__logo"
          />
          <p className="tct-eyebrow">Begin here</p>
          <h1 className="tct-page-title">Enquire About a Class</h1>
          <p className="tct-section-sub">
            {isPayment
              ? `Complete your details to reserve ${prefillDisplay}${paymentPrice ? ` for Rs ${Number(paymentPrice).toLocaleString("en-IN")}` : ""}.`
              : "Tell us what you'd love to learn — we'll call you back with batch timings."}
          </p>
        </div>
      </section>

      <section className="tct-section pt-0">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <form
                className="tct-form tct-form--light tct-form--entrance"
                onSubmit={submit}
                noValidate
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Your name *</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input
                      className="form-control"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email (optional)</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Please select class *</label>
                    <ClassSelect
                      key={shakeCount}
                      name="interest"
                      value={form.interest}
                      onChange={onChange}
                      invalid={classError}
                    />
                    {classError && (
                      <p className="tct-form-err mt-2 mb-0">
                        <i className="bi bi-exclamation-circle-fill" /> Please
                        select a class to continue.
                      </p>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="message"
                      value={form.message}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <button
                  className="btn tct-btn-gold tct-btn-lg mt-4 w-100"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending..."
                    : isPayment
                      ? "Continue to Payment"
                      : "Send Enquiry"}
                </button>
                {status === "sent" && (
                  <div className="tct-success mt-3" role="status">
                    <span className="tct-success__seal" aria-hidden="true">
                      <i className="bi bi-check-lg" />
                    </span>
                    <p className="tct-form-ok mb-0">
                      Thank you! We'll be in touch shortly.
                    </p>
                  </div>
                )}
                {status === "error" && (
                  <p className="tct-form-err mt-3">
                    <i className="bi bi-exclamation-circle-fill" /> Something
                    went wrong — please call us instead.
                  </p>
                )}
              </form>
            </div>

            <div className="col-lg-5">
              <div className="tct-contact-panel">
                <h3>Studio details</h3>
                <ul className="tct-contact list-unstyled">
                  <li>
                    <i className="bi bi-telephone-fill" />
                    <a href="tel:+919384846922">+91 9384846922</a>
                  </li>
                  <li>
                    <i className="bi bi-whatsapp" />
                    <a href="https://wa.me/919384846922" target="_blank" rel="noreferrer">
                      WhatsApp: +91 9384846922
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-envelope-fill" />
                    <a href="mailto:tctfashionhub@gmail.com">tctfashionhub@gmail.com</a>
                  </li>
                  <li>
                    <i className="bi bi-geo-alt-fill" />
                    <a
                      href="https://maps.app.goo.gl/RSYcKT7v23LzfoiL7"
                      target="_blank"
                      rel="noreferrer"
                      className="tct-maps-link"
                    >
                      No. 215, Second Floor, Shakthi Nagar, Near ICICI Bank
                      Ganapathy, Coimbatore - 641006.
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-clock-fill" /> Mon – Sat · 10 AM – 7 PM
                  </li>
                </ul>
              </div>
              <div className="tct-map-wrap mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62652.13282285873!2d76.97595559603275!3d11.056739248833322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8fca8ea954ccd%3A0x6d79791fad302083!2sTrend%20Code%20Technology!5e0!3m2!1sen!2sin!4v1790412466349!5m2!1sen!2sin"
                  title="TCT Fashion Hub location map"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="tct-note-card mt-4">
                <i className="bi bi-gift-fill" />
                <p>
                  Every enrolment includes a <strong>Basic Kit gift</strong> —
                  your materials are ready from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
