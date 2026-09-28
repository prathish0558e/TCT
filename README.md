# TCT Fashion Hub — Website

A premium gold-and-glass pricing website for **TCT Fashion Hub** (Ganapathy, Coimbatore — Since 2021), with:

- **Frontend:** React 18 + Bootstrap 5 (Vite) — ivory/day + night themes, glass UI
- **Backend:** Node/Express API (JavaScript) — one backend only, no Python needed

> **Single source of truth for ALL pricing/content: `backend/data/pricing.js`.**
> The Node API re-reads this file on EVERY request, so editing a price shows up
> instantly on the site — no server restart required.

## Sections

- Cinematic preloader with 3D logo handoff
- Hero with night starfield / gold dust (moon button or press **T** to toggle theme)
- Single classes with starter-kit gifts — click any card for the full class popup
- Combo classes (Signature Combo — All 7 Crafts carries the featured treatment)
- About the studio, including the leadership team (CEO & MD)
- Enquiry form (WhatsApp + API) with a gold confetti celebration
- Footer with social links and a tappable Google Maps address

## Class pricing (Rs) — REAL DATA (from backend/data/pricing.js)

| Class | Price | Duration |
| --- | --- | --- |
| Tailoring | 8,000 | 1 Month |
| Embroidery | 7,000 | 1 Month |
| Aari Work | 7,000 | 1 Month |
| Jewellery Making | 6,000 | 1 Month |
| Mehndi | 4,000 | 1 Month |
| Saree Pre-Pleating | 2,000 | 1 Month |

## Combos (Rs) — REAL DATA

| Combo | Price |
| --- | --- |
| Signature Combo — All 7 Crafts | 25,000 |
| Embroidery + Aari | 15,000 |
| Saree + Mehndi | 10,000 |
| Tailoring + Embroidery | 20,000 |
| Tailoring + Aari + Embroidery | 23,000 |
| Saree + Jewellery + Resin Art | 22,000 |

## Leadership

| Name | Role |
| --- | --- |
| Bharath T | Chief Executive Officer (CEO) |
| Mohanapriya K | Managing Director (MD) |

Photos live in `public/images/leadership/`.

## UPI payment setup (optional)

The Pay Now modal shows a **"Pay with UPI app"** button and a scan-and-pay QR
only when a UPI ID is configured.

1. Create a file named `.env` in the project root (next to `package.json`).
2. Add this line with your UPI ID (Google Pay / PhonePe / any UPI app):

   ```
   VITE_UPI_ID=tctfashionhub@okicici
   ```

   (Replace with your real UPI ID — the part after `@` depends on your bank/app.)
3. Restart `npm run dev`.

Without `.env`, the modal still works — WhatsApp and Email payment options remain.

## Run it

```bash
npm install
npm run dev
# Node API  → http://localhost:5000
# React app → http://localhost:5173   (the Vite proxy sends /api to the Node API)
```

### Production build

```bash
npm run build
node backend/server.js   # serves the built site + API on http://localhost:5000
```

## API endpoints (Node, port 5000)

`/api/health`, `/api/studio`, `/api/classes`, `/api/classes/:id`, `/api/combos`,
`/api/pricing`, `GET/POST /api/enquiries`
