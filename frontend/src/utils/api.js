import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// Attach JWT token to every request
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('gl_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Redirect to login on 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gl_token');
      localStorage.removeItem('gl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
