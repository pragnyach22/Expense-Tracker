from flask import Blueprint, request, jsonify
import bcrypt
import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name  = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    pwd   = data.get('password', '')
    if not name or not email or not pwd:
        return jsonify({'error': 'All fields required'}), 400
    hashed = bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()
    conn = db.get_conn(); cur = conn.cursor()
    try:
        cur.execute("INSERT INTO Users (name,email,password) VALUES (%s,%s,%s)", (name,email,hashed))
        conn.commit()
        uid = cur.lastrowid
        # seed default categories
        defaults = ['Food & Dining','Transport','Shopping','Healthcare','Entertainment','Utilities']
        for c in defaults:
            cur.execute("INSERT INTO Categories (user_id,name) VALUES (%s,%s)", (uid,c))
        conn.commit()
        return jsonify({'user_id': uid, 'name': name, 'email': email}), 201
    except Exception as e:
        return jsonify({'error': 'Email already registered'}), 409
    finally:
        cur.close(); conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data  = request.get_json()
    email = data.get('email','').strip().lower()
    pwd   = data.get('password','')
    conn  = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM Users WHERE email=%s", (email,))
    user = cur.fetchone(); cur.close(); conn.close()
    if not user or not bcrypt.checkpw(pwd.encode(), user['password'].encode()):
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'user_id': user['user_id'], 'name': user['name'], 'email': user['email']}), 200
