import json
import uuid
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

shipment_bp = Blueprint("shipment", __name__)
SHIPMENTS_FILE = "data/shipments.json"

VALID_STATUSES = ["pending", "shipped", "delivered", "cancelled"]


class Shipment:
    def __init__(
        self,
        user_id,
        sender_location,
        recipient_location,
        package_description,
        package_type,
        distance_km,
        total_price,
    ):
        self.shipment_id = str(uuid.uuid4())[:8].upper()
        self.user_id = user_id
        self.sender_location = sender_location
        self.recipient_location = recipient_location
        self.package_description = package_description
        self.package_type = package_type
        self.distance_km = distance_km
        self.total_price = total_price
        self.status = "pending"
        self.created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    def update_status(self, new_status):
        self.status = new_status

    # from object to dictionary
    def to_dict(self):
        return self.__dict__


def load_shipments():
    try:
        with open(SHIPMENTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_shipments(shipments):
    with open(SHIPMENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(shipments, f, ensure_ascii=False, indent=2)


@shipment_bp.route("/shipment/confirm", methods=["POST"])
def confirm_shipment():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body."}), 400

    required = [
        "sender_location",
        "recipient_location",
        "package_description",
        "package_type",
        "distance_km",
        "total_price",
        "user_id",
    ]
    # check if there is a missing value
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 422

    shipment = Shipment(
        sender_location=data["sender_location"],
        recipient_location=data["recipient_location"],
        package_description=data["package_description"],
        package_type=data["package_type"],
        distance_km=data["distance_km"],
        total_price=data["total_price"],
        user_id=data["user_id"],
    )

    shipments = load_shipments()
    shipments.append(shipment.to_dict())
    save_shipments(shipments)

    return (
        jsonify({"shipment_id": shipment.shipment_id, "status": shipment.status}),
        201,
    )


@shipment_bp.route("/shipment/<shipment_id>/status", methods=["PATCH"])
def update_shipment_status(shipment_id):
    data = request.get_json(silent=True)
    if not data or "status" not in data:
        return jsonify({"error": "Missing 'status' field."}), 400

    shipments = load_shipments()

    for entry in shipments:
        if entry["shipment_id"] == shipment_id.upper():
            # Reconstruct object to use update_status method
            shipment = Shipment.__new__(Shipment)
            shipment.__dict__.update(entry)

            try:
                shipment.update_status(data["status"])
            except ValueError as e:
                return jsonify({"error": str(e)}), 422

            entry["status"] = shipment.status
            save_shipments(shipments)
            return (
                jsonify(
                    {"shipment_id": shipment.shipment_id, "status": shipment.status}
                ),
                200,
            )

    return jsonify({"error": f"Shipment '{shipment_id}' not found."}), 404
