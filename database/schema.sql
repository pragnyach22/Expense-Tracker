-- Spendexia Expense Tracker - MySQL Schema
CREATE DATABASE IF NOT EXISTS spendexia;
USE spendexia;

CREATE TABLE IF NOT EXISTS Users (
    user_id  INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(50) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Categories (
    cat_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name    VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Budgets (
    budget_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Expenses (
    expense_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    cat_id      INT NOT NULL,
    amount      DECIMAL(10,2) NOT NULL,
    date        DATE NOT NULL,
    description VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cat_id)  REFERENCES Categories(cat_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Alerts (
    alert_id   INT AUTO_INCREMENT PRIMARY KEY,
    budget_id  INT NOT NULL,
    message    VARCHAR(250) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES Budgets(budget_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Monthly_Reports (
    report_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    month         INT NOT NULL,
    year          INT NOT NULL,
    total_expense DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
