from flask import Blueprint, request, jsonify
from routes.alerts import ensure_current_budget_alerts
import db

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/set_budget', methods=['POST'])
def set_budget():
    d = request.get_json()
    uid = d['user_id']; limit = d['limit_amount']
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute("SELECT budget_id FROM Budgets WHERE user_id=%s", (uid,))
    row = cur.fetchone()
    if row:
        cur.execute("UPDATE Budgets SET limit_amount=%s WHERE user_id=%s", (limit, uid))
        bid = row[0]
    else:
        cur.execute("INSERT INTO Budgets (user_id,limit_amount) VALUES (%s,%s)", (uid, limit))
        bid = cur.lastrowid
    conn.commit(); cur.close(); conn.close()
    ensure_current_budget_alerts(uid)
    return jsonify({'budget_id': bid, 'limit_amount': limit})

@budget_bp.route('/budget', methods=['GET'])
def get_budget():
    uid = request.args.get('user_id')
    conn = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM Budgets WHERE user_id=%s", (uid,))
    row = cur.fetchone(); cur.close(); conn.close()
    return jsonify(row or {})
