from flask import Blueprint, request, jsonify
import db

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports', methods=['GET'])
def get_reports():
    uid = request.args.get('user_id')
    conn = db.get_conn(); cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT * FROM Monthly_Reports WHERE user_id=%s ORDER BY year DESC, month DESC LIMIT 12",
        (uid,)
    )
    rows = cur.fetchall(); cur.close(); conn.close()
    return jsonify(rows)
