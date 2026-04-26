import json
import uuid
from datetime import datetime, timezone

USERS_FILE = "data/users.json"


# used with open() to ensure auto closed the file after finishing
def read_users():
    with open(USERS_FILE) as f:
        # extract the file content
        # convert the JSON to python object (list/dictionaries)
        return json.load(f)


def write_users(data):
    with open(USERS_FILE, "w") as f:
        json.dump(data, f, indent=2)


def find_user_by_email(email):
    data = read_users()
    for user in data["users"]:
        if user["email"].lower() == email.lower():
            return user
    return None


def create_user(full_name, email, hashed_password):
    data = read_users()
    new_user = {
        "id": str(uuid.uuid4()),
        "full_name": full_name,
        "email": email.lower(),
        "password": hashed_password,
        "reset_token": None,
        "reset_token_expiry": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    data["users"].append(new_user)
    write_users(data)
    return new_user
