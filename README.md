# 💰 Spendexia — Expense Tracker

Full-stack expense tracker: React + Flask + MySQL with a soft mint-green theme.

## Quick Start

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
# Set env vars (or create a .env file):
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=yourpassword
export DB_NAME=spendexia
python app.py
# Runs on http://localhost:5000
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Project Structure
```
expense-tracker/
├── frontend/          React app
│   ├── src/
│   │   ├── api.js        All Flask API calls (Axios)
│   │   ├── App.js        Auth routing
│   │   ├── pages/        Dashboard, Expenses, Budget, Categories, Reports, Alerts, Profile
│   │   └── components/   Sidebar
├── backend/           Flask REST API
│   ├── app.py
│   ├── db.py
│   └── routes/        auth, expenses, categories, budget, reports, alerts
└── database/
    └── schema.sql     MySQL DDL
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /register | Register user |
| POST | /login | Login |
| GET | /expenses | List expenses (filter by month/cat) |
| POST | /add_expense | Add expense |
| PUT | /update_expense | Edit expense |
| DELETE | /delete_expense/:id | Delete expense |
| GET/POST | /categories | List / add categories |
| PUT/DELETE | /categories/:id | Edit / delete category |
| GET | /budget | Get budget |
| POST | /set_budget | Set budget |
| GET | /reports | Monthly reports |
| GET/POST | /alerts | List / create alerts |
