import React, { useEffect, useState } from 'react';
import { getExpenses, getCategories, deleteExpense } from '../api';
import toast from 'react-hot-toast';

const fmtMoney = v => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 });
const fmtDate  = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
const currentYM = () => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`; };
const BADGE_COLORS = ['#e8f5f0:#2e7d5e','#eaf4fb:#1a5a8a','#fef3ee:#b05a1a','#f0edf8:#5c3a9e','#fefbe8:#7a5c10','#fde8e8:#8b1a1a'];
const badge = (name, i) => {
  const [bg, col] = BADGE_COLORS[i % BADGE_COLORS.length].split(':');
  return <span style={{ background:bg, color:col, borderRadius:20, padding:'.22rem .75rem', fontSize:'.75rem', fontWeight:700 }}>{name}</span>;
};

export default function ExpenseList({ user, onEdit }) {
  const [exps, setExps]     = useState([]);
  const [cats, setCats]     = useState([]);
  const [month, setMonth]   = useState(currentYM());
  const [catFilter, setCatFilter] = useState('');

  const load = () => {
    getExpenses(user.user_id, month || undefined, catFilter || undefined).then(r => setExps(r.data));
  };
  useEffect(() => { getCategories(user.user_id).then(r => setCats(r.data)); }, [user]);
  useEffect(() => { load(); }, [month, catFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await deleteExpense(id, user.user_id);
    toast.success('Expense deleted');
    load();
  };

  const inp = { padding:'.5rem .75rem', border:'1.5px solid #e8f0ec', borderRadius:8, fontFamily:'Nunito,sans-serif', fontSize:'.85rem', color:'#1a3028', background:'#fff', outline:'none' };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.75rem', marginBottom:'1.25rem' }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>All Expenses</h2>
          <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Track and manage your spending</p>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={inp}/>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={inp}>
            <option value="">All categories</option>
            {cats.map(c => <option key={c.cat_id} value={c.cat_id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', overflow:'hidden' }}>
        {exps.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#9eb8ac' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>🌿</div>
            <p>No expenses found for this period</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.875rem' }}>
              <thead>
                <tr style={{ borderBottom:'1.5px solid #e8f0ec' }}>
                  {['Date','Description','Category','Amount','Actions'].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'.65rem 1rem', fontSize:'.75rem', fontWeight:700, color:'#9eb8ac', textTransform:'uppercase', letterSpacing:'.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exps.map(e => {
                  const cat = cats.find(c => c.cat_id === e.cat_id);
                  const ci  = cats.findIndex(c => c.cat_id === e.cat_id);
                  return (
                    <tr key={e.expense_id} style={{ borderBottom:'1px solid #e8f0ec' }}
                        onMouseEnter={ev=>ev.currentTarget.style.background='#f7faf8'}
                        onMouseLeave={ev=>ev.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'.7rem 1rem', color:'#5a7a6c' }}>{fmtDate(e.date)}</td>
                      <td style={{ padding:'.7rem 1rem', fontWeight:600 }}>{e.description || '—'}</td>
                      <td style={{ padding:'.7rem 1rem' }}>{cat ? badge(cat.name, ci) : '—'}</td>
                      <td style={{ padding:'.7rem 1rem', fontWeight:800, color:'#1a3028' }}>{fmtMoney(e.amount)}</td>
                      <td style={{ padding:'.7rem 1rem' }}>
                        <div style={{ display:'flex', gap:'.35rem' }}>
                          <button onClick={() => onEdit(e)} style={{ width:30, height:30, borderRadius:6, border:'none', background:'#eaf4fb', color:'#3a8cc4', cursor:'pointer', fontWeight:700, fontSize:'.85rem' }}>✎</button>
                          <button onClick={() => handleDelete(e.expense_id)} style={{ width:30, height:30, borderRadius:6, border:'none', background:'#fde8e8', color:'#c0392b', cursor:'pointer', fontWeight:700, fontSize:'.85rem' }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
