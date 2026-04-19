import React from 'react';

const navItems = [
  { id:'dashboard',   label:'Dashboard',   icon:'⊞' },
  { id:'expenses',    label:'Expenses',    icon:'≡' },
  { id:'addExpense',  label:'Add Expense', icon:'⊕' },
  { id:'budget',      label:'Budget',      icon:'◷' },
  { id:'categories',  label:'Categories',  icon:'⊠' },
  { id:'reports',     label:'Reports',     icon:'↗' },
  { id:'alerts',      label:'Alerts',      icon:'🔔' },
  { id:'profile',     label:'Profile',     icon:'◉' },
];

export default function Sidebar({ active, onNavigate, alertCount }) {
  return (
    <div style={{ width:210, background:'#fff', borderRight:'1px solid #e8f0ec', padding:'1.25rem .75rem', flexShrink:0, overflowY:'auto' }}>
      {navItems.map(item => (
        <div key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            display:'flex', alignItems:'center', gap:'.6rem',
            padding:'.6rem .85rem', borderRadius:8, cursor:'pointer',
            fontSize:'.875rem', fontWeight: active===item.id ? 700 : 500,
            color: active===item.id ? '#2e7d5e' : '#5a7a6c',
            background: active===item.id ? '#e8f5f0' : 'transparent',
            marginBottom:'.15rem', transition:'all .15s', userSelect:'none',
          }}>
          <span style={{ fontSize:14 }}>{item.icon}</span>
          <span style={{ flex:1 }}>{item.label}</span>
          {item.id==='alerts' && alertCount>0 && (
            <span style={{ background:'#f07a3a', color:'#fff', borderRadius:10, padding:'1px 7px', fontSize:'.7rem' }}>{alertCount}</span>
          )}
        </div>
      ))}
    </div>
  );
}
