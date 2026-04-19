import React, { useState, useEffect } from 'react';
import AuthPage  from './pages/AuthPage';
import MainApp   from './pages/MainApp';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gl_user')); } catch { return null; }
  });

  const handleLogin  = (u) => { localStorage.setItem('gl_user', JSON.stringify(u)); setUser(u); };
  const handleLogout = ()  => { localStorage.removeItem('gl_user'); setUser(null); };

  return user
    ? <MainApp user={user} onLogout={handleLogout} />
    : <AuthPage onLogin={handleLogin} />;
}
