# 💰 Spendexia — Personal Expense Tracker

> A full-stack personal finance and expense tracking application built with **React**, **Flask**, and **MySQL**. Track your spending, set budgets, manage categories, and visualize monthly reports — all wrapped in a clean, mint-green themed UI.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Setup (Flask)](#3-backend-setup-flask)
  - [4. Frontend Setup (React)](#4-frontend-setup-react)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Expenses](#expenses)
  - [Categories](#categories)
  - [Budget](#budget)
  - [Reports](#reports)
  - [Alerts](#alerts)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Register & login with bcrypt password hashing |
| 📊 **Interactive Dashboard** | Real-time overview with stat cards, budget usage bar, recent expenses, and a category-wise spending bar chart (Recharts) |
| 💸 **Expense Management** | Add, edit, delete, and filter expenses by month and category |
| 🏷️ **Custom Categories** | Create, rename, and delete spending categories; 6 defaults seeded on registration |
| 💰 **Budget Tracking** | Set a monthly spending limit with a dynamic progress bar and percentage indicator |
| 📈 **Monthly Reports** | Auto-generated monthly totals with visual charts |
| 🔔 **Smart Alerts** | Auto-triggered notifications when spending hits 80% or exceeds the budget |
| 👤 **User Profile** | View and manage account information |
| 🎨 **Mint-Green Theme** | Soft, modern UI with a cohesive pastel color palette and smooth card-based layout |
| 📱 **Responsive Design** | Works across desktop, tablet, and mobile screen sizes |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | Component-based UI framework |
| [Axios](https://axios-http.com/) | HTTP client for API communication |
| [Recharts](https://recharts.org/) | Charting library for data visualization |
| [React Hot Toast](https://react-hot-toast.com/) | Toast notifications |
| CSS Custom Properties | Theming with a mint-green design system |

### Backend
| Technology | Purpose |
|---|---|
| [Flask 3.0](https://flask.palletsprojects.com/) | Lightweight Python web framework |
| [Flask-CORS](https://flask-cors.readthedocs.io/) | Cross-origin resource sharing |
| [bcrypt](https://pypi.org/project/bcrypt/) | Secure password hashing |
| [mysql-connector-python](https://dev.mysql.com/doc/connector-python/en/) | MySQL database driver |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | Environment variable management |

### Database
| Technology | Purpose |
|---|---|
| [MySQL](https://www.mysql.com/) | Relational database for persistent data storage |

---

## 🏗 Architecture

```
┌──────────────────┐         HTTP          ┌──────────────────┐         SQL          ┌──────────────┐
│                  │  ◄──────────────────►  │                  │  ◄──────────────────► │              │
│   React SPA      │     localhost:3000     │   Flask API      │     localhost:3306    │   MySQL DB   │
│   (Frontend)     │     ───proxy───►:5000  │   (Backend)      │                      │  (spendexia) │
│                  │                        │                  │                      │              │
└──────────────────┘                        └──────────────────┘                      └──────────────┘
      Axios                                   Blueprints:                              6 Tables:
      Recharts                                 • auth                                  • Users
      React Hot Toast                          • expenses                              • Categories
                                               • categories                            • Budgets
                                               • budget                                • Expenses
                                               • reports                               • Alerts
                                               • alerts                                • Monthly_Reports
```

The frontend proxies API requests to the Flask backend (configured in `package.json` → `"proxy": "http://localhost:5000"`). The backend uses modular **Flask Blueprints** for route organization and connects to MySQL for data persistence.

---

## 📁 Project Structure

```
expense-tracker/
├── frontend/                    # React single-page application
│   ├── public/                  # Static assets & index.html
│   ├── src/
│   │   ├── api.js               # Axios API client (all backend calls)
│   │   ├── App.js               # Root component — auth gate
│   │   ├── index.js             # React entry point
│   │   ├── components/
│   │   │   └── Sidebar.js       # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── AuthPage.js      # Login & registration page
│   │   │   ├── MainApp.js       # Authenticated app shell with routing
│   │   │   ├── Dashboard.js     # Overview with charts & stats
│   │   │   ├── ExpenseList.js   # List, filter, and manage expenses
│   │   │   ├── AddExpense.js    # Add new expense form
│   │   │   ├── Budget.js        # Budget setting & tracking
│   │   │   ├── Categories.js    # Category CRUD management
│   │   │   ├── Reports.js       # Monthly spending reports
│   │   │   ├── Alerts.js        # Budget alert notifications
│   │   │   └── Profile.js       # User profile page
│   │   ├── styles/
│   │   │   └── global.css       # CSS variables & global styles
│   │   └── utils/
│   │       ├── AuthContext.js    # Auth context provider
│   │       └── api.js           # Utility API helpers
│   ├── package.json
│   └── package-lock.json
│
├── backend/                     # Flask REST API server
│   ├── app.py                   # Flask app entry point & blueprint registration
│   ├── db.py                    # Database connection & schema initialization
│   ├── auth_middleware.py       # JWT authentication decorator
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (git-ignored)
│   ├── .env.example             # Example environment file
│   └── routes/
│       ├── __init__.py
│       ├── auth.py              # /register, /login
│       ├── expenses.py          # CRUD + monthly report auto-update
│       ├── categories.py        # Category CRUD
│       ├── budget.py            # Get/set budget
│       ├── budgets.py           # Additional budget operations
│       ├── reports.py           # Monthly report generation
│       └── alerts.py            # Budget alert management
│
├── database/
│   └── schema.sql               # MySQL DDL — creates all 6 tables
│
└── .gitignore
```

---

## 📋 Prerequisites

Ensure the following are installed on your system:

| Software | Version | Download |
|---|---|---|
| **Node.js** | ≥ 16.x | [nodejs.org](https://nodejs.org/) |
| **npm** | ≥ 8.x | Bundled with Node.js |
| **Python** | ≥ 3.9 | [python.org](https://www.python.org/) |
| **MySQL** | ≥ 8.0 | [mysql.com](https://dev.mysql.com/downloads/) |
| **pip** | Latest | Bundled with Python |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
```

### 2. Database Setup

Start your MySQL server, then run the schema file to create the `spendexia` database and all required tables:

```bash
mysql -u root -p < database/schema.sql
```

This will create:
- The `spendexia` database
- 6 tables: `Users`, `Categories`, `Budgets`, `Expenses`, `Alerts`, `Monthly_Reports`

### 3. Backend Setup (Flask)

```bash
# Navigate to the backend directory
cd backend

# (Recommended) Create and activate a virtual environment
python -m venv .venv

# Activate — Windows:
.venv\Scripts\activate
# Activate — macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials:
#   DB_HOST=localhost
#   DB_USER=root
#   DB_PASS=yourpassword
#   DB_NAME=spendexia

# Start the Flask server
python app.py
```

The backend API will be available at **http://localhost:5000**.

> **Note:** On first run, `app.py` calls `db.init_db()` which automatically executes `schema.sql` to ensure all tables exist.

### 4. Frontend Setup (React)

Open a **new terminal** window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The React app will open at **http://localhost:3000** and automatically proxy API requests to the Flask backend.

---

## ⚙ Environment Variables

Create a `.env` file inside the `backend/` directory (use `.env.example` as a template):

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL server hostname | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASS` | MySQL password | _(empty)_ |
| `DB_NAME` | Database name | `spendexia` |

---

## 📖 API Reference

Base URL: `http://localhost:5000`

### Authentication

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/register` | Register a new user | `{ name, email, password }` |
| `POST` | `/login` | Authenticate user | `{ email, password }` |

<details>
<summary><strong>POST /register</strong> — Example</summary>

**Request:**
```json
{
  "name": "Ganesh",
  "email": "ganesh@example.com",
  "password": "secureP@ss123"
}
```

**Response (201):**
```json
{
  "user_id": 1,
  "name": "Ganesh",
  "email": "ganesh@example.com"
}
```

> 6 default categories are automatically seeded: Food & Dining, Transport, Shopping, Healthcare, Entertainment, Utilities.
</details>

<details>
<summary><strong>POST /login</strong> — Example</summary>

**Request:**
```json
{
  "email": "ganesh@example.com",
  "password": "secureP@ss123"
}
```

**Response (200):**
```json
{
  "user_id": 1,
  "name": "Ganesh",
  "email": "ganesh@example.com"
}
```
</details>

---

### Expenses

| Method | Endpoint | Description | Params / Body |
|--------|----------|-------------|---------------|
| `GET` | `/expenses` | List expenses | Query: `user_id`, `month` (YYYY-MM), `cat_id` |
| `POST` | `/add_expense` | Add a new expense | `{ user_id, cat_id, amount, date, description }` |
| `PUT` | `/update_expense` | Update an expense | `{ expense_id, user_id, cat_id, amount, date, description }` |
| `DELETE` | `/delete_expense/:id` | Delete an expense | Query: `user_id` |

<details>
<summary><strong>POST /add_expense</strong> — Example</summary>

**Request:**
```json
{
  "user_id": 1,
  "cat_id": 2,
  "amount": 450.00,
  "date": "2026-04-23",
  "description": "Uber ride to office"
}
```

**Response (201):**
```json
{
  "expense_id": 15
}
```

> Adding/updating/deleting an expense automatically recalculates the corresponding monthly report and triggers budget alerts if thresholds are crossed.
</details>

---

### Categories

| Method | Endpoint | Description | Params / Body |
|--------|----------|-------------|---------------|
| `GET` | `/categories` | List user categories | Query: `user_id` |
| `POST` | `/categories` | Create a category | `{ user_id, name }` |
| `PUT` | `/categories/:id` | Update a category | `{ user_id, name }` |
| `DELETE` | `/categories/:id` | Delete a category | Query: `user_id` |

---

### Budget

| Method | Endpoint | Description | Params / Body |
|--------|----------|-------------|---------------|
| `GET` | `/budget` | Get user's budget | Query: `user_id` |
| `POST` | `/set_budget` | Set/update budget limit | `{ user_id, limit_amount }` |

---

### Reports

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| `GET` | `/reports` | Get monthly reports | Query: `user_id` |

---

### Alerts

| Method | Endpoint | Description | Params / Body |
|--------|----------|-------------|---------------|
| `GET` | `/alerts` | List budget alerts | Query: `user_id` |
| `POST` | `/alerts` | Create a manual alert | `{ budget_id, message }` |

> **Smart Alerts:** The system automatically generates alerts when monthly spending reaches **80%** (warning) or **100%** (over budget) of the set limit.

---

## 🗄 Database Schema

The `spendexia` database consists of **6 tables** with the following relationships:

```
┌──────────┐       ┌────────────┐       ┌──────────┐
│  Users   │──1:N─►│ Categories │◄──N:1─│ Expenses │
│          │──1:N─►│            │       │          │
│          │──1:N─►├────────────┤       └──────────┘
│          │       │  Budgets   │──1:N─►┌──────────┐
│          │──1:N─►│            │       │  Alerts  │
│          │       └────────────┘       └──────────┘
│          │──1:N─►┌─────────────────┐
└──────────┘       │ Monthly_Reports │
                   └─────────────────┘
```

### Table Details

| Table | Key Columns | Description |
|-------|------------|-------------|
| **Users** | `user_id` (PK), `name`, `email` (UNIQUE), `password` | Registered user accounts with bcrypt-hashed passwords |
| **Categories** | `cat_id` (PK), `user_id` (FK), `name` | Spending categories scoped per user |
| **Budgets** | `budget_id` (PK), `user_id` (FK), `limit_amount` | Monthly spending limit per user |
| **Expenses** | `expense_id` (PK), `user_id` (FK), `cat_id` (FK), `amount`, `date`, `description` | Individual expense records |
| **Alerts** | `alert_id` (PK), `budget_id` (FK), `message`, `created_at` | Budget threshold notifications |
| **Monthly_Reports** | `report_id` (PK), `user_id` (FK), `month`, `year`, `total_expense` | Aggregated monthly spending totals |

---

## 📸 Screenshots

> _Add screenshots of your application here to showcase the UI._

| Page | Description |
|------|-------------|
| **Login / Register** | Clean authentication page with toggle between login and register forms |
| **Dashboard** | Overview with stat cards, budget progress bar, recent expenses, and category chart |
| **Expenses** | Filterable expense list with add/edit/delete functionality |
| **Budget** | Budget setting with visual progress tracking |
| **Categories** | Category management with CRUD operations |
| **Reports** | Monthly spending reports with data visualization |
| **Alerts** | Budget alert notifications with auto-generated warnings |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|---------|
| `mysql` command not found | Add MySQL to your system PATH or use the full path to the mysql executable |
| `Access denied for user 'root'` | Verify your `.env` credentials match your MySQL setup |
| Frontend can't reach backend | Ensure Flask is running on port 5000 and check the `proxy` field in `package.json` |
| `ModuleNotFoundError` on Python imports | Activate your virtual environment and re-run `pip install -r requirements.txt` |
| Port 3000/5000 already in use | Kill the existing process or change the port in the respective config |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Coding Guidelines

- Follow existing code style and naming conventions
- Keep Flask routes modular using Blueprints
- Use React functional components with hooks
- Maintain the existing color palette and design system

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React, Flask & MySQL**

[⬆ Back to Top](#-spendexia--personal-expense-tracker)

</div>
