import React, { useEffect, useState } from 'react';
import { getAlerts } from '../api';

const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

export default function Alerts({ user }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts(user.user_id).then(r => setAlerts(r.data)).catch(() => setAlerts([]));
  }, [user]);

  const typeStyle = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes('exceeded') || m.includes('over')) return { bg:'#fde8e8', col:'#8b1a1a', border:'#e05252', label:'Budget Exceeded' };
    if (m.includes('approaching') || m.includes('%')) return { bg:'#fef3e2', col:'#7a4a0a', border:'#f0b429', label:'Budget Warning' };
    return { bg:'#eaf4fb', col:'#1a4a70', border:'#3a8cc4', label:'Info' };
  };

  return (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>Alerts & Notifications</h2>
        <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Budget alerts and spending warnings</p>
      </div>
      {alerts.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'3rem', textAlign:'center', color:'#9eb8ac' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>🔔</div>
          <p style={{ fontWeight:600 }}>No alerts — you're on track!</p>
          <p style={{ fontSize:'.85rem', marginTop:'.3rem' }}>Alerts appear when you approach or exceed your budget.</p>
        </div>
      ) : alerts.map(a => {
        const st = typeStyle(a.message);
        return (
          <div key={a.alert_id} style={{ padding:'.9rem 1.1rem', borderRadius:10, marginBottom:'.75rem', background:st.bg, color:st.col, borderLeft:`4px solid ${st.border}` }}>
            <div style={{ fontWeight:700, marginBottom:'.25rem' }}>{st.label}</div>
            <div style={{ fontSize:'.875rem' }}>{a.message}</div>
            {a.created_at && <div style={{ fontSize:'.75rem', opacity:.7, marginTop:'.25rem' }}>{fmtDate(a.created_at)}</div>}
          </div>
        );
      })}
    </div>
  );
}
