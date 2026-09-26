# TCT Garment Fashion — Flask service (Python backend)
# Computes totals, validates combo prices and stores enquiries.
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import time

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "pricing.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    DATA = json.load(f)

SINGLE_CLASSES = {c["id"]: c for c in DATA["singleClasses"]}
COMBOS = {c["id"]: c for c in DATA["comboClasses"]}


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "tct-python-service"})


@app.get("/api/studio")
def studio():
    return jsonify(DATA["studio"])


@app.get("/api/classes")
def classes():
    return jsonify(DATA["singleClasses"])


@app.get("/api/combos")
def combos():
    return jsonify(DATA["comboClasses"])


@app.get("/api/pricing")
def pricing():
    return jsonify(DATA)


@app.get("/api/classes/<class_id>")
def class_detail(class_id):
    found = SINGLE_CLASSES.get(class_id)
    if not found:
        return jsonify({"error": "Class not found"}), 404
    return jsonify(found)


def combo_strikethrough(combo):
    """What the same classes would cost bought individually."""
    total = 0
    for item in combo["items"]:
        for c in DATA["singleClasses"]:
            item_key = item.lower().replace(" class", "").strip()
            c_key = c["name"].lower().replace(" class", "").strip()
            if item_key == c_key:
                total += c["price"]
    # Resin Art has no single-class entry; returns None if nothing matched
    return total or None


@app.get("/api/combos/<combo_id>/summary")
def combo_summary(combo_id):
    combo = COMBOS.get(combo_id)
    if not combo:
        return jsonify({"error": "Combo not found"}), 404
    individual = combo_strikethrough(combo)
    return jsonify(
        {
            "id": combo["id"],
            "name": combo["name"],
            "items": combo["items"],
            "total": combo["total"],
            "individualTotal": individual,
            "youSave": (individual - combo["total"]) if individual else None,
        }
    )


@app.post("/api/quote")
def quote():
    """Custom quote: send {classIds: [...]} and get the itemised total."""
    body = request.get_json(silent=True) or {}
    ids = body.get("classIds", [])
    if not ids or not isinstance(ids, list):
        return jsonify({"error": "classIds must be a non-empty list"}), 400

    lines, total, unknown = [], 0, []
    for cid in ids:
        c = SINGLE_CLASSES.get(cid)
        if not c:
            unknown.append(cid)
            continue
        lines.append({"id": c["id"], "name": c["name"], "price": c["price"]})
        total += c["price"]

    if unknown:
        return jsonify({"error": "Unknown class ids", "unknown": unknown}), 400

    return jsonify({"lines": lines, "total": total, "currency": "Rs"})


ENQUIRIES = []


@app.post("/api/enquiries")
def create_enquiry():
    """Store a class enquiry: {name, phone, interest, message}."""
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    phone = (body.get("phone") or "").strip()
    if not name or not phone:
        return jsonify({"error": "Name and phone are required."}), 400
    enquiry = {
        "id": len(ENQUIRIES) + 1,
        "name": name,
        "phone": phone,
        "interest": body.get("interest") or "Not specified",
        "message": body.get("message") or "",
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    ENQUIRIES.append(enquiry)
    return jsonify({"ok": True, "enquiry": enquiry}), 201


@app.get("/api/enquiries")
def list_enquiries():
    return jsonify(ENQUIRIES)


@app.errorhandler(404)
def not_found(_e):
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=False)
