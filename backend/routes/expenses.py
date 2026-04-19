from flask import Blueprint, request, jsonify
import db

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/expenses', methods=['GET'])
def get_expenses():
    uid   = request.args.get('user_id')
    month = request.args.get('month')   # YYYY-MM
    cat   = request.args.get('cat_id')
    conn  = db.get_conn(); cur = conn.cursor(dictionary=True)
    sql   = "SELECT * FROM Expenses WHERE user_id=%s"
    args  = [uid]
    if month:
        sql += " AND DATE_FORMAT(date,'%%Y-%%m')=%s"; args.append(month)
    if cat:
        sql += " AND cat_id=%s"; args.append(cat)
    sql += " ORDER BY date DESC"
    cur.execute(sql, args)
    rows = cur.fetchall(); cur.close(); conn.close()
    for r in rows: r['date'] = str(r['date'])
    return jsonify(rows)

@expenses_bp.route('/add_expense', methods=['POST'])
def add_expense():
    d = request.get_json()
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute(
        "INSERT INTO Expenses (user_id,cat_id,amount,date,description) VALUES (%s,%s,%s,%s,%s)",
        (d['user_id'], d['cat_id'], d['amount'], d['date'], d.get('description'))
    )
    conn.commit(); eid = cur.lastrowid
    cur.close(); conn.close()
    _update_monthly_report(d['user_id'], d['date'][:7])
    return jsonify({'expense_id': eid}), 201

@expenses_bp.route('/update_expense', methods=['PUT'])
def update_expense():
    d = request.get_json()
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute(
        "UPDATE Expenses SET cat_id=%s,amount=%s,date=%s,description=%s WHERE expense_id=%s AND user_id=%s",
        (d['cat_id'], d['amount'], d['date'], d.get('description'), d['expense_id'], d['user_id'])
    )
    conn.commit(); cur.close(); conn.close()
    _update_monthly_report(d['user_id'], d['date'][:7])
    return jsonify({'updated': True})

@expenses_bp.route('/delete_expense/<int:eid>', methods=['DELETE'])
def delete_expense(eid):
    uid = request.args.get('user_id')
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute("SELECT date FROM Expenses WHERE expense_id=%s", (eid,))
    row = cur.fetchone()
    cur.execute("DELETE FROM Expenses WHERE expense_id=%s AND user_id=%s", (eid, uid))
    conn.commit(); cur.close(); conn.close()
    if row:
        _update_monthly_report(uid, str(row[0])[:7])
    return jsonify({'deleted': True})

def _update_monthly_report(user_id, ym):
    year, month = ym.split('-')
    conn = db.get_conn(); cur = conn.cursor()
    cur.execute(
        "SELECT COALESCE(SUM(amount),0) FROM Expenses WHERE user_id=%s AND DATE_FORMAT(date,'%%Y-%%m')=%s",
        (user_id, ym)
    )
    total = float(cur.fetchone()[0] or 0)
    cur.execute(
        "SELECT report_id FROM Monthly_Reports WHERE user_id=%s AND month=%s AND year=%s",
        (user_id, month, year)
    )
    existing = cur.fetchone()
    if existing:
        cur.execute("UPDATE Monthly_Reports SET total_expense=%s WHERE report_id=%s", (total, existing[0]))
    else:
        cur.execute(
            "INSERT INTO Monthly_Reports (user_id,month,year,total_expense) VALUES (%s,%s,%s,%s)",
            (user_id, month, year, total)
        )
    conn.commit(); cur.close(); conn.close()
    _create_budget_alert_if_needed(user_id, ym, total)


def _create_budget_alert_if_needed(user_id, ym, total):
    conn = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT budget_id, limit_amount FROM Budgets WHERE user_id=%s", (user_id,))
    budget = cur.fetchone()
    if not budget or budget['limit_amount'] is None:
        cur.close(); conn.close(); return

    limit = float(budget['limit_amount'])
    if limit <= 0:
        cur.close(); conn.close(); return

    message = None
    if total >= limit:
        message = f"You have exceeded your budget for {ym}. Total spending is ₹{total:.2f} and your limit is ₹{limit:.2f}."
    elif total >= limit * 0.8:
        percentage = int((total / limit) * 100)
        message = f"You're approaching your budget for {ym}: {percentage}% used."

    if not message:
        cur.close(); conn.close(); return

    cur.execute("SELECT alert_id FROM Alerts WHERE budget_id=%s AND message=%s", (budget['budget_id'], message))
    if cur.fetchone():
        cur.close(); conn.close(); return

    cur.execute("INSERT INTO Alerts (budget_id,message) VALUES (%s,%s)", (budget['budget_id'], message))
    conn.commit(); cur.close(); conn.close()
