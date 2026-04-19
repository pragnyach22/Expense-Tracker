"""
Budget routes:
  GET  /set_budget   – fetch current budget
  POST /set_budget   – create/update budget
"""
from flask import Blueprint, request, jsonify
from db import get_db
from auth_middleware import token_required

budgets_bp = Blueprint('budgets', __name__)


@budgets_bp.route('/set_budget', methods=['GET'])
@token_required
def get_budget():
    uid = request.user_id
    conn = get_db(); cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            'SELECT * FROM Budgets WHERE user_id=%s ORDER BY budget_id DESC LIMIT 1',
            (uid,)
        )
        row = cursor.fetchone()
        if row:
            row['limit_amount'] = float(row['limit_amount'])
        return jsonify(row or {})
    finally:
        cursor.close(); conn.close()


@budgets_bp.route('/set_budget', methods=['POST'])
@token_required
def set_budget():
    uid  = request.user_id
    data = request.get_json() or {}
    limit = data.get('limit_amount')
    if not limit or float(limit) <= 0:
        return jsonify({'error': 'Valid limit_amount required'}), 400

    conn = get_db(); cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            'SELECT budget_id FROM Budgets WHERE user_id=%s ORDER BY budget_id DESC LIMIT 1',
            (uid,)
        )
        existing = cursor.fetchone()
        if existing:
            cursor.execute('UPDATE Budgets SET limit_amount=%s WHERE budget_id=%s',
                           (float(limit), existing['budget_id']))
            bid = existing['budget_id']
        else:
            cursor.execute('INSERT INTO Budgets (user_id,limit_amount) VALUES (%s,%s)',
                           (uid, float(limit)))
            bid = cursor.lastrowid
        conn.commit()
        return jsonify({'budget_id': bid, 'limit_amount': float(limit)})
    finally:
        cursor.close(); conn.close()
