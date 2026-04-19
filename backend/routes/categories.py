from flask import Blueprint, request, jsonify
import db

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    uid = request.args.get('user_id')
    conn = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM Categories WHERE user_id=%s ORDER BY name", (uid,))
    rows = cur.fetchall(); cur.close(); conn.close()
    return jsonify(rows)

@categories_bp.route('/categories', methods=['POST'])
def add_category():
    d = request.get_json()
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute("INSERT INTO Categories (user_id,name) VALUES (%s,%s)", (d['user_id'], d['name']))
    conn.commit(); cid = cur.lastrowid; cur.close(); conn.close()
    return jsonify({'cat_id': cid}), 201

@categories_bp.route('/categories/<int:cid>', methods=['PUT'])
def update_category(cid):
    d = request.get_json()
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute("UPDATE Categories SET name=%s WHERE cat_id=%s AND user_id=%s", (d['name'], cid, d['user_id']))
    conn.commit(); cur.close(); conn.close()
    return jsonify({'updated': True})

@categories_bp.route('/categories/<int:cid>', methods=['DELETE'])
def delete_category(cid):
    uid = request.args.get('user_id')
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM Expenses WHERE cat_id=%s", (cid,))
    if cur.fetchone()[0] > 0:
        cur.close(); conn.close()
        return jsonify({'error': 'Category has expenses'}), 409
    cur.execute("DELETE FROM Categories WHERE cat_id=%s AND user_id=%s", (cid, uid))
    conn.commit(); cur.close(); conn.close()
    return jsonify({'deleted': True})
