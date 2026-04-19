import mysql.connector
import os

DB_CONFIG = {
    'host':     os.getenv('DB_HOST', 'localhost'),
    'user':     os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASS', ''),
    'database': os.getenv('DB_NAME', 'spendexia'),
}

def get_conn():
    return mysql.connector.connect(**DB_CONFIG)

def init_db():
    """Run schema.sql to create tables if they don't exist."""
    schema_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schema.sql')
    conn = mysql.connector.connect(
        host=DB_CONFIG['host'], user=DB_CONFIG['user'], password=DB_CONFIG['password']
    )
    cursor = conn.cursor()
    with open(schema_path, 'r') as f:
        for stmt in f.read().split(';'):
            stmt = stmt.strip()
            if stmt:
                try:
                    cursor.execute(stmt)
                except Exception:
                    pass
    conn.commit()
    cursor.close()
    conn.close()
