import React, { useState } from 'react';
import { login, register } from '../api';
import toast from 'react-hot-toast';

export default function AuthPage({ onLogin }) {
  const [mode, setMode]     = useState('login');
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');

  const handleSubmit = async () => {
    if (!email || !pass || (mode === 'register' && !name)) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (mode === 'login') {
        const { data } = await login({ email, password: pass });
        toast.success('Welcome back, ' + data.name + '!');
        onLogin(data);
      } else {
        const { data } = await register({ name, email, password: pass });
        toast.success('Account created!');
        onLogin(data);
      }
    } catch (e) {
      toast.error(e.response?.data?.error || 'Something went wrong');
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at top left, rgba(236, 238, 241, 0.9), transparent 35%), #eef2f5',
    },
    card: {
      width: '100%',
      maxWidth: 1040,
      minHeight: 640,
      borderRadius: 34,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 35px 90px rgba(17, 31, 48, 0.16)',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      gap: 0,
    },
    formPane: {
      padding: '3rem 3rem 3rem 3rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#fff',
    },
    badge: {
      alignSelf: 'flex-start',
      padding: '0.65rem 1rem',
      borderRadius: 999,
      background: '#f9efe3',
      color: '#9c6f4d',
      fontSize: '.8rem',
      fontWeight: 700,
      marginBottom: '1.5rem',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
    },
    heading: {
      fontSize: '2.85rem',
      fontWeight: 800,
      lineHeight: 1.05,
      color: '#1f2d33',
      marginBottom: '0.75rem',
    },
    description: {
      color: '#5d6f78',
      fontSize: '1rem',
      lineHeight: 1.8,
      maxWidth: 360,
      marginBottom: '2.5rem',
    },
    label: {
      display: 'block',
      fontSize: '.78rem',
      fontWeight: 700,
      color: '#7d8b96',
      marginBottom: '.5rem',
      textTransform: 'uppercase',
      letterSpacing: '.04em',
    },
    input: {
      width: '100%',
      padding: '1rem 1.1rem',
      border: '1.5px solid #e8ecef',
      borderRadius: 16,
      fontSize: '.95rem',
      color: '#1f2d33',
      background: '#fbfcfd',
      outline: 'none',
      marginBottom: '1.25rem',
    },
    button: {
      width: '100%',
      padding: '1rem 1.15rem',
      borderRadius: 16,
      border: 'none',
      background: '#b77f4e',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'transform .2s ease, box-shadow .2s ease',
      boxShadow: '0 14px 32px rgba(183, 127, 78, 0.22)',
    },
    buttonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 18px 36px rgba(183, 127, 78, 0.28)',
    },
    switchText: {
      marginTop: '1.75rem',
      color: '#7d8b96',
      fontSize: '.95rem',
      lineHeight: 1.6,
    },
    switchLink: {
      color: '#2b6246',
      cursor: 'pointer',
      fontWeight: 700,
      marginLeft: '0.3rem',
    },
    visualPane: {
      position: 'relative',
      minHeight: 640,
      overflow: 'hidden',
      flex: 1,
      backgroundImage: 'url(/login.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    visualBackground: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(255,255,255,0.18)',
      zIndex: 0,
    },
    visualImage: {
      display: 'none',
    },
    visualOverlay: {
      position: 'absolute',
      top: '2rem',
      left: '2rem',
      zIndex: 2,
      padding: '1rem 1.15rem',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.95)',
      color: '#3c4b50',
      fontSize: '.88rem',
      fontWeight: 700,
      boxShadow: '0 18px 40px rgba(17, 31, 48, 0.10)',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.formPane}>
          <span style={styles.badge}>{mode === 'login' ? 'Login' : 'Create Account'}</span>
          <h1 style={styles.heading}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p style={styles.description}>
            {mode === 'login'
              ? 'Sign in to track expenses, set budgets, and get helpful reports in one polished dashboard.'
              : 'Register now to start managing your budget with personalized expense insights.'}
          </p>

          {mode === 'register' && (
            <>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <button style={styles.button} onClick={handleSubmit}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <p style={styles.switchText}>
            {mode === 'login' ? (
              <>No account? <span style={styles.switchLink} onClick={() => setMode('register')}>Register</span></>
            ) : (
              <>Already have an account? <span style={styles.switchLink} onClick={() => setMode('login')}>Sign in</span></>
            )}
          </p>
        </div>
        <div style={styles.visualPane}>
          <div style={styles.visualBackground} />
          <div style={styles.visualOverlay}>Secure login with your private workspace</div>
        </div>
      </div>
    </div>
  );
}
