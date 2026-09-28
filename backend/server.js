// TCT Garment Fashion — Node/Express API (JavaScript backend)
const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

require("./lib/env").loadEnv();
const {
  validateEnquiry,
  saveEnquiry,
  listEnquiries,
  getEnquiry,
  updateEnquiry,
  rateLimit,
} = require("./lib/enquiries");
const whatsapp = require("./services/whatsapp");

// Hot-reload pricing data: re-read the module on every request so edits to
// backend/data/pricing.js show up instantly, with NO server restart needed.
const pricingPath = require.resolve("./data/pricing");
const getPricing = () => {
  delete require.cache[pricingPath];
  return require("./data/pricing");
};
const pricing = getPricing();

const app = express();
// Ignore a bogus inherited PORT (e.g. 0); default to 5000.
// This single JavaScript API is the ONLY backend — the Vite proxy targets it.
const PORT = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 5000;

app.use(cors());
// Keep the raw body around for Meta webhook signature verification.
app.use(express.json({ limit: "200kb", verify: (_req, _res, buf) => { _req.rawBody = buf; } }));

// ---- API routes -----------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "tct-node-api" });
});

app.get("/api/studio", (_req, res) => {
  res.json(getPricing().studio);
});

// Single classes
app.get("/api/classes", (_req, res) => {
  res.json(getPricing().singleClasses);
});

app.get("/api/classes/:id", (req, res) => {
  const found = getPricing().singleClasses.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Class not found" });
  res.json(found);
});

// Combos
app.get("/api/combos", (_req, res) => {
  res.json(getPricing().comboClasses);
});

// Everything the pricing page needs, in one call
app.get("/api/pricing", (_req, res) => {
  const p = getPricing();
  res.json({
    studio: p.studio,
    singleClasses: p.singleClasses,
    comboClasses: p.comboClasses,
  });
});

// ---- Class enrolment enquiry (JSON-file store + WhatsApp automation) ------
app.post("/api/enquiries", (req, res) => {
  const ip = req.ip || "unknown";
  if (!rateLimit(ip)) {
    return res
      .status(429)
      .json({ ok: false, error: "Too many enquiries. Please try again later." });
  }

  const result = validateEnquiry(req.body || {});
  if (!result.ok) {
    return res
      .status(400)
      .json({ ok: false, error: "Validation failed", errors: result.errors });
  }

  const enquiry = saveEnquiry(result.data, { ip });

  // WhatsApp automation runs in the background: a studio alert to the company
  // number and an automatic thank-you to the customer. The form never waits
  // for (or fails because of) WhatsApp — a 201 goes out immediately.
  setImmediate(async () => {
    const studio = await whatsapp.sendEnquiryNotification(enquiry);
    const thanks = await whatsapp.sendCustomerThankYou(enquiry);
    const stateFor = (r) =>
      r.ok ? "sent" : r.skipped ? "not_sent" : "failed";
    updateEnquiry(enquiry.id, {
      whatsapp_studio_message_status: stateFor(studio),
      studio_message_id: studio.id || "",
      whatsapp_customer_message_status: stateFor(thanks),
      customer_message_id: thanks.id || "",
    });
    console.log(
      `[enquiry #${enquiry.id}] studio: ${stateFor(studio)}` +
        `${studio.error ? ` (${studio.error})` : ""} | customer: ${stateFor(thanks)}` +
        `${thanks.error ? ` (${thanks.error})` : ""}`
    );
  });

  res.status(201).json({
    ok: true,
    enquiry: {
      id: enquiry.id,
      name: enquiry.name,
      phone: enquiry.phone,
      whatsapp_number: enquiry.whatsapp_number,
      email: enquiry.email,
      service: enquiry.service,
      message: enquiry.message,
      status: enquiry.status,
      whatsapp_customer_message_status: enquiry.whatsapp_customer_message_status,
      created_at: enquiry.created_at,
    },
  });
});

app.get("/api/enquiries", (_req, res) => res.json(listEnquiries()));

app.get("/api/enquiries/:id", (req, res) => {
  const found = getEnquiry(req.params.id);
  if (!found) return res.status(404).json({ error: "Enquiry not found" });
  res.json(found);
});

// ---- WhatsApp Cloud API webhook (official Meta Business Platform) ---------
// GET: one-time verification handshake with Meta (hub.mode / verify_token /
// hub.challenge).
app.get("/api/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token && token === whatsapp.cfg().verifyToken) {
    console.log("[whatsapp] webhook verified by Meta");
    return res.status(200).send(challenge);
  }
  console.warn("[whatsapp] webhook verification rejected");
  return res.sendStatus(403);
});

// POST: incoming messages + delivery status events.
app.post("/api/whatsapp/webhook", (req, res) => {
  // Optional but recommended: verify X-Hub-Signature-256 with the Meta app
  // secret so nobody can fake webhook calls. Active only when
  // WHATSAPP_APP_SECRET is set in .env.
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (secret && req.rawBody) {
    const expected =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex");
    const got = req.get("X-Hub-Signature-256") || "";
    const okSig =
      got.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
    if (!okSig) {
      console.warn("[whatsapp] webhook signature mismatch — rejected");
      return res.sendStatus(401);
    }
  }

  // ACK immediately — Meta retries slow webhooks.
  res.sendStatus(200);

  // Process safely in the background.
  try {
    const body = req.body || {};
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};

        // Delivery status events: sent / delivered / read / failed.
        for (const st of value.statuses || []) {
          patchEnquiryByMessageId(st.id, st.status);
        }

        // Incoming customer messages → auto-reply through the Cloud API.
        for (const msg of value.messages || []) {
          const contactName = value.contacts?.[0]?.profile?.name || "";
          const parsed = whatsapp.processIncomingMessage({
            ...msg,
            profile: { name: contactName },
          });
          console.log(
            `[whatsapp] in ← ${parsed.from}${parsed.name ? ` (${parsed.name})` : ""}: "${parsed.text}"`
          );
          setImmediate(() => whatsapp.sendTextMessage(parsed.from, parsed.reply));
        }
      }
    }
  } catch (e) {
    console.error("[whatsapp] webhook processing error:", e.message);
  }
});

// Map a Meta status event (sent/delivered/read/failed) back to its enquiry.
function patchEnquiryByMessageId(messageId, status) {
  if (!messageId || !status) return;
  for (const e of listEnquiries()) {
    if (e.studio_message_id === messageId) {
      updateEnquiry(e.id, { whatsapp_studio_message_status: status });
      return;
    }
    if (e.customer_message_id === messageId) {
      updateEnquiry(e.id, { whatsapp_customer_message_status: status });
      return;
    }
  }
}

// ---- Serve the built React app (production) -------------------------------
app.use(express.static(path.join(__dirname, "..", "dist")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`TCT Node API + site running at http://localhost:${PORT}`);
});

// Friendly message instead of a scary crash when an old server is still running
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      `\n[X] Port ${PORT} already in use — an older TCT node server is still running.` +
        `\n    Fix: close the old window (or run: taskkill /F /IM node.exe), then "npm run dev" again.\n`
    );
    process.exit(1);
  }
  throw err;
});
