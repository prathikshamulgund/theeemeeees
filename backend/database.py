import os
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """
    Establish and return a MySQL connection using environment variables.
    Works seamlessly in Docker environment.
    """
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "mysql"),  # Docker service name
            user=os.getenv("DB_USER", "user"),
            password=os.getenv("DB_PASSWORD", "password"),
            database=os.getenv("DB_NAME", "minemind"),
            port=int(os.getenv("DB_PORT", 3306))
        )
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
    return None
