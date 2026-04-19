from datetime import datetime
from flask import Blueprint, request, jsonify
import db

alerts_bp = Blueprint('alerts', __name__)

def ensure_current_budget_alerts(user_id):
    conn = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT budget_id, limit_amount FROM Budgets WHERE user_id=%s", (user_id,))
    budgets = cur.fetchall()
    if not budgets:
        cur.close(); conn.close(); return

    ym = datetime.now().strftime('%Y-%m')
    cur.execute(
        "SELECT COALESCE(SUM(amount),0) AS total FROM Expenses WHERE user_id=%s AND DATE_FORMAT(date,'%%Y-%%m')=%s",
        (user_id, ym)
    )
    total = float(cur.fetchone()['total'] or 0)

    for budget in budgets:
        limit = float(budget['limit_amount'] or 0)
        if limit <= 0:
            continue

        message = None
        if total >= limit:
            message = f"You have exceeded your budget for {ym}. Total spending is ₹{total:.2f} and your limit is ₹{limit:.2f}."
        elif total >= limit * 0.8:
            percentage = int((total / limit) * 100)
            message = f"You're approaching your budget for {ym}: {percentage}% used."

        if not message:
            continue

        cur.execute("SELECT alert_id FROM Alerts WHERE budget_id=%s AND message=%s", (budget['budget_id'], message))
        if cur.fetchone():
            continue

        cur.execute("INSERT INTO Alerts (budget_id,message) VALUES (%s,%s)", (budget['budget_id'], message))
        conn.commit()

    cur.close(); conn.close()

@alerts_bp.route('/alerts', methods=['GET'])
def get_alerts():
    uid = request.args.get('user_id')
    ensure_current_budget_alerts(uid)
    conn = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT a.* FROM Alerts a JOIN Budgets b ON a.budget_id=b.budget_id WHERE b.user_id=%s ORDER BY a.created_at DESC",
        (uid,)
    )
    rows = cur.fetchall(); cur.close(); conn.close()
    for r in rows:
        if r.get('created_at'): r['created_at'] = str(r['created_at'])
    return jsonify(rows)

@alerts_bp.route('/alerts', methods=['POST'])
def create_alert():
    d = request.get_json()
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute("INSERT INTO Alerts (budget_id,message) VALUES (%s,%s)", (d['budget_id'], d['message']))
    conn.commit(); aid = cur.lastrowid; cur.close(); conn.close()
    return jsonify({'alert_id': aid}), 201
