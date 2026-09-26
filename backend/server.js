// TCT Garment Fashion — Node/Express API (JavaScript backend)
const express = require("express");
const cors = require("cors");
const path = require("path");

// Hot-reload pricing data: re-read the module on every request so edits to
// backend/data/pricing.js show up instantly, with NO server restart needed.
const pricingPath = require.resolve("./data/pricing");
const getPricing = () => {
  delete require.cache[pricingPath];
  return require("./data/pricing");
};
const pricing = getPricing();

const app = express();
// Ignore a bogus inherited PORT (e.g. 0); use 5000 unless explicitly set
// (5001 is reserved for the Python Flask service, which the Vite proxy targets)
const PORT = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 5000;

app.use(cors());
app.use(express.json());

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

// Class enrolment enquiry (in-memory store, demo)
const enquiries = [];
app.post("/api/enquiries", (req, res) => {
  const { name, phone, message, interest } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  const enquiry = {
    id: enquiries.length + 1,
    name,
    phone,
    interest: interest || "Not specified",
    message: message || "",
    createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  res.status(201).json({ ok: true, enquiry });
});

app.get("/api/enquiries", (_req, res) => res.json(enquiries));

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
