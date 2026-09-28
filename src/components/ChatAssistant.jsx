import { useEffect, useRef, useState } from "react";

// Floating studio assistant: the round launcher shows the COMPANY LOGO
// (not a WhatsApp glyph). Clicking it opens an on-site chat panel that
// answers questions about classes, fees, kits, timings and booking from
// the live pricing data — and can hand the chat over to real WhatsApp
// with the full transcript when the user wants a human.

const WA_NUMBER = "919384846922";
const STUDIO = {
  name: "TCT Fashion Hub",
  phone: "+91 93848 46922",
  hours: "Mon – Sat · 10 AM – 7 PM",
  address: "No. 215, 2nd Floor, Shakthi Nagar, Near ICICI Bank Ganapathy, Coimbatore – 641006",
};

let seq = 0;
const nextId = () => `m${++seq}`;

const GREETING = {
  id: nextId(),
  from: "bot",
  text:
    "Vanakkam! 👋 I'm the TCT studio assistant.\n\nAsk me anything — class fees, kit gifts, batch timings, or booking. You can also tap a quick question below.",
};

const QUICK_CHIPS = [
  "Class fees",
  "What combos do you have?",
  "Batch timings",
  "How do I book a seat?",
];

function buildPricingReply(p) {
  const lines = p.singleClasses
    .map((c) => `• ${c.name} — Rs ${Number(c.price).toLocaleString("en-IN")} (${c.duration})`)
    .join("\n");
  const combos = p.comboClasses
    .map((c) => `• ${c.name} — Rs ${Number(c.total).toLocaleString("en-IN")}`)
    .join("\n");
  return (
    "Our current fees (starter kit gift included in every class):\n\n" +
    lines +
    "\n\n✨ Combos for bigger savings:\n" +
    combos +
    "\n\nTap \"Book a seat\" below and our team will confirm your batch."
  );
}

// Very small intent matcher — feels like an assistant without any API key.
function answer(text, pricing) {
  const t = String(text || "").toLowerCase();
  const has = (...words) => words.some((w) => t.includes(w));
  const p = pricing;

  // Specific class asked by name?
  const all = [
    ...p.singleClasses.map((c) => ({ ...c, kind: "single", amount: c.price })),
    ...p.comboClasses.map((c) => ({ ...c, kind: "combo", amount: c.total })),
  ];
  const hit = all.find((c) => c.name.toLowerCase().split(/ — | \+ /).some((part) => t.includes(part.toLowerCase()) && part.length > 4));
  if (hit && has("fee", "price", "cost", "charge", "how much", "rate", "ena-vilai", "vilai")) {
    return {
      text:
        `${hit.name}: Rs ${Number(hit.amount).toLocaleString("en-IN")} (${hit.duration}).\n\n` +
        (hit.gift ? `🎁 ${hit.gift}.\n\n` : "\n") +
        'Want to join? Type "book" and we will guide you!',
    };
  }

  if (has("fee", "price", "cost", "charge", "how much", "rate", "vilai")) {
    return { text: buildPricingReply(p), pricing: true };
  }

  if (has("combo", "package", "bundle", "offer")) {
    const lines = p.comboClasses
      .map((c) => `• ${c.name} — Rs ${Number(c.total).toLocaleString("en-IN")} (${c.duration})`)
      .join("\n");
    return {
      text:
        "Our combos save you money while you learn more crafts:\n\n" +
        lines +
        "\n\nAll combos include combined kit gifts. Ask me about any one for details!",
    };
  }

  if (has("time", "timing", "batch", "hour", "when", "schedule", "open")) {
    return {
      text:
        `We are open ${STUDIO.hours}.\n\nMorning, afternoon and evening batches are available for most classes — tell us your preferred time while booking and we will place you in a comfortable batch.`,
    };
  }

  if (has("book", "join", "admission", "enrol", "enroll", "seat", "appointment", "start")) {
    return {
      text:
        "Wonderful! 🌟 Booking is simple:\n\n1. Tap \"Enquire Now\" in the menu (or the button below)\n2. Fill your name, phone and pick your class\n3. Our team calls you back to confirm the batch\n\nPrefer chatting? Tap \"Chat on WhatsApp\" and we will continue there!",
      book: true,
    };
  }

  if (has("kit", "material", "gift", "included")) {
    return {
      text:
        "Every class begins with a starter kit gift — on the house! 🎁\n\n• Tailoring: measuring tape, chalk set & handbook\n• Embroidery: 24-skein threads, needles & design sheets\n• Aari: needles, frame & zari threads\n• Mehndi: organic cones, practice sheets & oils\n…and more for every craft!",
    };
  }

  if (has("where", "address", "location", "reach", "map", "direction")) {
    return {
      text: `We are at:\n${STUDIO.address}\n\nLandmark: Near ICICI Bank, Ganapathy. Tap \"Get directions\" below!`,
      map: true,
    };
  }

  if (has("certificate", "certified")) {
    return { text: "Yes! Every course ends with a TCT Fashion Hub certificate and a showcase of your finished work. 🎓" };
  }

  if (has("hello", "hi", "hey", "vanakkam", "hai")) {
    return { text: "Vanakkam! 😊 Ask me about class fees, combos, timings or booking — I'm here to help." };
  }

  if (has("thank", "nandri")) {
    return { text: "You're most welcome! 🙏 Anything else you'd like to know?" };
  }

  // Fallback: nudge to a human
  return {
    text:
      "Good question! I can help best with:\n\n• Class fees & combos\n• Batch timings\n• Kit gifts\n• Booking a seat\n\nFor anything else, our team will reply personally on WhatsApp — tap \"Chat on WhatsApp\" below.",
    human: true,
  };
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [night, setNight] = useState(
    () => document.documentElement.classList.contains("tct-night")
  );
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pricing, setPricing] = useState({ singleClasses: [], comboClasses: [] });
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Mirror the night theme class for style toggles
  useEffect(() => {
    const el = document.documentElement;
    const obs = () => setNight(el.classList.contains("tct-night"));
    obs();
    const mo = new MutationObserver(obs);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // Live pricing data for real answers
  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) =>
        setPricing({ singleClasses: d.singleClasses || [], comboClasses: d.comboClasses || [] })
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Escape closes the chat
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (raw) => {
    const text = String(raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId(), from: "user", text }]);
    setTyping(true);
    // Small human-like delay so the assistant feels alive
    setTimeout(() => {
      const a = answer(text, pricing);
      setTyping(false);
      setMessages((m) => [...m, { id: nextId(), from: "bot", text: a.text, meta: a }]);
    }, 650 + Math.random() * 450);
  };

  const transcriptHref = () => {
    const body =
      "Hello TCT Fashion Hub! I was chatting with the website assistant.\n\n" +
      messages
        .filter((m) => m.from === "user")
        .map((m) => `• ${m.text}`)
        .join("\n") +
      "\n\nPlease continue our conversation here.";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(body)}`;
  };

  return (
    <>
      {/* Round launcher with the company logo */}
      <button
        type="button"
        className={`tct-chat-launcher${night ? " tct-chat-launcher--night" : ""}${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Chat with TCT Fashion Hub"}
        title="Chat with us"
      >
        <span className="tct-chat-launcher__ring" aria-hidden="true" />
        {open ? (
          <i className="bi bi-x-lg" aria-hidden="true" />
        ) : (
          <img src="/images/Logo.jpeg" alt="" className="tct-chat-launcher__logo" />
        )}
        {!open && <span className="tct-chat-launcher__dot" aria-hidden="true" />}
      </button>

      {/* Chat panel */}
      <section
        className={`tct-chat-panel${night ? " tct-chat-panel--night" : ""}${open ? " is-open" : ""}`}
        role="dialog"
        aria-label="TCT Fashion Hub chat assistant"
        aria-hidden={!open}
      >
        <header className="tct-chat-panel__head">
          <img src="/images/Logo.jpeg" alt="" className="tct-chat-panel__logo" />
          <div className="tct-chat-panel__title">
            <strong>TCT Fashion Hub</strong>
            <span>
              <i className="bi bi-circle-fill tct-chat-online-dot" /> Online now
            </span>
          </div>
          <a
            className="tct-chat-panel__wa"
            href={transcriptHref()}
            target="_blank"
            rel="noopener noreferrer"
            title="Continue on WhatsApp"
            aria-label="Continue on WhatsApp"
          >
            <i className="bi bi-whatsapp" />
          </a>
        </header>

        <div className="tct-chat-panel__list" ref={listRef}>
          {messages.map((m) => (
            <div key={m.id} className={`tct-chat-msg tct-chat-msg--${m.from}`}>
              {m.text.split("\n").map((line, i) => (
                <p key={i} className={line.startsWith("•") ? "is-bullet" : ""}>
                  {line || "\u00A0"}
                </p>
              ))}
              {m.meta?.book && (
                <a className="tct-chat-msg__cta" href="/enquire">
                  <i className="bi bi-calendar-check" /> Book a seat
                </a>
              )}
              {m.meta?.map && (
                <a
                  className="tct-chat-msg__cta"
                  href="https://maps.app.goo.gl/RSYcKT7v23LzfoiL7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-geo-alt" /> Get directions
                </a>
              )}
              {m.meta?.human && (
                <a
                  className="tct-chat-msg__cta"
                  href={transcriptHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-whatsapp" /> Chat on WhatsApp
                </a>
              )}
            </div>
          ))}
          {typing && (
            <div className="tct-chat-msg tct-chat-msg--bot tct-chat-msg--typing">
              <span className="tct-chat-dot" />
              <span className="tct-chat-dot" />
              <span className="tct-chat-dot" />
            </div>
          )}
        </div>

        <div className="tct-chat-panel__chips">
          {QUICK_CHIPS.map((c) => (
            <button key={c} type="button" onClick={() => send(c)}>
              {c}
            </button>
          ))}
        </div>

        <form
          className="tct-chat-panel__input"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about classes, fees…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Type your message"
          />
          <button type="submit" aria-label="Send message">
            <i className="bi bi-send-fill" />
          </button>
        </form>
      </section>
    </>
  );
}
