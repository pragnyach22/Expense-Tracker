import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar    from '../components/Sidebar';
import Dashboard  from './Dashboard';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';
import Budget     from './Budget';
import Categories from './Categories';
import Reports    from './Reports';
import Alerts     from './Alerts';
import Profile    from './Profile';
import { getAlerts } from '../api';

export default function MainApp({ user, onLogout }) {
  const [view, setView]       = useState('dashboard');
  const [editData, setEditData] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    getAlerts(user.user_id).then(r => setAlertCount(r.data.length)).catch(()=>{});
  }, [user, view]);

  const navigate = (v) => { setView(v); if (v==='addExpense') setEditData(null); };

  const handleEdit = (exp) => { setEditData(exp); setView('addExpense'); };
  const handleDone = () => { setEditData(null); setView('expenses'); };

  const initials = currentUser.name.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2);
  const now = new Date();

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Toaster position="top-right" toastOptions={{ style:{ fontFamily:'Nunito,sans-serif', fontSize:'.875rem' } }}/>

      {/* Topbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e8f0ec', padding:'.75rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,60,40,.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
          <img src="/logo.png" alt="Spendexia" style={{ width:36, height:36, borderRadius:8 }} />
          <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#1a3028' }}>Spendexia</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.85rem' }}>
          <span style={{ fontSize:'.85rem', color:'#5a7a6c' }}>{now.toLocaleString('default',{month:'long',year:'numeric'})}</span>
          <div onClick={()=>navigate('profile')} style={{ width:36, height:36, background:'#c8bfe8', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'.85rem', color:'#5c3a9e', cursor:'pointer' }}>{initials}</div>
          <button onClick={onLogout} style={{ padding:'.45rem 1rem', background:'transparent', color:'#2e7d5e', border:'1.5px solid #4caf85', borderRadius:8, fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Sign out</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar active={view} onNavigate={navigate} alertCount={alertCount}/>
        <div style={{ flex:1, overflowY:'auto', padding:'1.5rem', background:'#f0f7f4' }}>
          {view==='dashboard'   && <Dashboard user={currentUser}/>}
          {view==='expenses'    && <ExpenseList user={currentUser} onEdit={handleEdit}/>}
          {view==='addExpense'  && <AddExpense user={currentUser} editData={editData} onDone={handleDone}/>}
          {view==='budget'      && <Budget user={currentUser}/>}
          {view==='categories'  && <Categories user={currentUser}/>}
          {view==='reports'     && <Reports user={currentUser}/>}
          {view==='alerts'      && <Alerts user={currentUser}/>}
          {view==='profile'     && <Profile user={currentUser} onUserUpdate={u=>{setCurrentUser(u);localStorage.setItem('gl_user',JSON.stringify(u));}}/>}
        </div>
      </div>
    </div>
  );
}
