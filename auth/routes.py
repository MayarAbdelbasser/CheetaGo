from flask import Blueprint, request, jsonify, session
from auth.helpers import find_user_by_email, create_user
import bcrypt

# divide the app into modules
# "auth" represents the blueprint name
auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()

    full_name = body.get("full_name", "").strip()
    email = body.get("email", "").strip()
    password = body.get("password", "").strip()

    # validation
    if not full_name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters"}), 400

    if find_user_by_email(email):
        return jsonify({"error": "Email already exists"})

    # hash the password
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # create user
    user = create_user(full_name, email, hashed.decode("utf-8"))

    return (
        jsonify(
            {"message": "User added successfully"},
            {
                "user": {
                    "id": user["id"],
                    "full_name": user["full_name"],
                    "email": user["email"],
                }
            },
        ),
        201,
    )


@auth_bp.route("/signin", methods=["POST"])
def signin():
    body = request.json

    email = body.get("email", "").strip()
    password = body.get("password", "").strip()

    # validation
    if not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # get user
    user = find_user_by_email(email)
    if not user:
        return jsonify({"error": "Email or password are wrong"}), 401

    # check password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Email or password are wrong"}), 401

    # save session
    session[user["id"]] = user["id"]
    session[user["email"]] = user["email"]
    session[user["full_name"]] = user["full_name"]

    return (
        jsonify(
            {
                "message": "Signed in successfully",
                "user": {
                    "id": user["id"],
                    "full_name": user["full_name"],
                    "email": user["email"],
                },
            }
        ),
        200,
    )
