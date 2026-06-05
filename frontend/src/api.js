import axios from 'axios';

const API = axios.create({
  baseURL: 'https://expense-tracker-api-gld0.onrender.com'
});

// Auth
export const register  = (d) => API.post('/register', d);
export const login     = (d) => API.post('/login', d);

// Expenses
export const getExpenses    = (uid, month, cat) => API.get('/expenses', { params: { user_id: uid, month, cat_id: cat } });
export const addExpense     = (d) => API.post('/add_expense', d);
export const updateExpense  = (d) => API.put('/update_expense', d);
export const deleteExpense  = (eid, uid) => API.delete(`/delete_expense/${eid}`, { params: { user_id: uid } });

// Categories
export const getCategories  = (uid) => API.get('/categories', { params: { user_id: uid } });
export const addCategory    = (d)   => API.post('/categories', d);
export const updateCategory = (cid, d) => API.put(`/categories/${cid}`, d);
export const deleteCategory = (cid, uid) => API.delete(`/categories/${cid}`, { params: { user_id: uid } });

// Budget
export const getBudget  = (uid) => API.get('/budget', { params: { user_id: uid } });
export const setBudget  = (d)   => API.post('/set_budget', d);

// Reports
export const getReports = (uid) => API.get('/reports', { params: { user_id: uid } });

// Alerts
export const getAlerts  = (uid) => API.get('/alerts', { params: { user_id: uid } });
export const createAlert = (d)  => API.post('/alerts', d);
