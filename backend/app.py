from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.expenses import expenses_bp
from routes.categories import categories_bp
from routes.budget import budget_bp
from routes.reports import reports_bp
from routes.alerts import alerts_bp
import db
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(expenses_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(budget_bp)
app.register_blueprint(reports_bp)
app.register_blueprint(alerts_bp)

if __name__ == '__main__':
    db.init_db()
    app.run(debug=True, port=5000)
