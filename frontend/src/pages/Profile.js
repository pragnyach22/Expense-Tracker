import React, { useEffect, useState } from 'react';
import { getExpenses, getCategories } from '../api';
import toast from 'react-hot-toast';

const fmtMoney = v => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 });

export default function Profile({ user, onUserUpdate }) {
  const [exps, setExps]   = useState([]);
  const [cats, setCats]   = useState([]);
  const [name, setName]   = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pass, setPass]   = useState('');

  useEffect(() => {
    getExpenses(user.user_id).then(r => setExps(r.data));
    getCategories(user.user_id).then(r => setCats(r.data));
  }, [user]);

  const total = exps.reduce((s,e) => s+Number(e.amount), 0);
  const initials = user.name.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) { toast.error('Name and email required'); return; }
    toast.success('Profile saved (update via API in production)');
    onUserUpdate({ ...user, name, email });
  };

  const inp = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid #e8f0ec', borderRadius:8, fontSize:'.9rem', color:'#1a3028', background:'#f7faf8', outline:'none', fontFamily:'Nunito,sans-serif' };
  const lbl = { display:'block', fontSize:'.78rem', fontWeight:700, color:'#5a7a6c', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.04em' };

  return (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>Profile</h2>
        <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Your account settings</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.5rem', textAlign:'center' }}>
          <div style={{ width:72, height:72, background:'linear-gradient(135deg,#c8e6d8,#c8bfe8)', borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', fontWeight:800, color:'#2e7d5e', marginBottom:'1rem' }}>{initials}</div>
          <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'#1a3028', margin:0 }}>{user.name}</h3>
          <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.25rem' }}>{user.email}</p>
          <div style={{ height:1, background:'#e8f0ec', margin:'1.25rem 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-around' }}>
            {[['Expenses', exps.length], ['Total Spent', fmtMoney(total)], ['Categories', cats.length]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#1a3028' }}>{val}</div>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:'#9eb8ac', textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.5rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Edit Profile</div>
          <div style={{ marginBottom:'1rem' }}><label style={lbl}>Full Name</label><input style={inp} value={name} onChange={e=>setName(e.target.value)}/></div>
          <div style={{ marginBottom:'1rem' }}><label style={lbl}>Email</label><input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div style={{ height:1, background:'#e8f0ec', margin:'1rem 0' }}/>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Change Password</div>
          <div style={{ marginBottom:'1.25rem' }}><label style={lbl}>New Password</label><input style={inp} type="password" placeholder="New password" value={pass} onChange={e=>setPass(e.target.value)}/></div>
          <button onClick={handleSave} style={{ padding:'.7rem 1.5rem', background:'#4caf85', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
