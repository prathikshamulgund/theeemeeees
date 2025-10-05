from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import mysql.connector
import os

auth_bp = Blueprint("auth", __name__)

db_config = {
    "host": os.getenv("DB_HOST", "mysql"),
    "user": os.getenv("DB_USER", "user"),
    "password": os.getenv("DB_PASSWORD", "password"),
    "database": os.getenv("DB_NAME", "minemind"),
    "port": int(os.getenv("DB_PORT", 3306)),
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# ---------- Signup ----------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    region = data.get("region")
    organization = data.get("organization")

    if not full_name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (full_name, email, password_hash, region, organization) VALUES (%s, %s, %s, %s, %s)",
            (full_name, email, generate_password_hash(password), region, organization),
        )
        conn.commit()
        return jsonify({"message": "User created"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    finally:
        cursor.close()
        conn.close()

# ---------- Login ----------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user["email"])
    return jsonify({"token": token}), 200

# ---------- Protected Route ----------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    return jsonify({"email": current_user}), 200
