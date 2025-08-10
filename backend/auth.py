import json
from werkzeug.security import check_password_hash

def load_users():
    with open("users.json") as f:
        return json.load(f)

def authenticate(email, password):
    users = load_users()
    user = users.get(email)
    if user and check_password_hash(user["password"], password):
        return {"email": email, "role": user["role"]}
    return None
