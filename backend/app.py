from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime
import os
import mysql.connector
from mysql.connector import Error

# Import auth blueprint
from auth_routes import auth_bp

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY", "supersecretkey")
jwt = JWTManager(app)

# DB Connection (for other routes if needed)
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "mysql"),
            user=os.getenv("DB_USER", "user"),
            password=os.getenv("DB_PASSWORD", "password"),
            database=os.getenv("DB_NAME", "minemind"),
            port=int(os.getenv("DB_PORT", 3306))
        )
        return conn
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        return None

# Register routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI Mining Operations Co-Pilot",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"✅ Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
