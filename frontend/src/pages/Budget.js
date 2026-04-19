import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { getBudget, setBudget, getExpenses } from '../api';
import toast from 'react-hot-toast';

const fmtMoney = v => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 });

export default function Budget({ user }) {
  const [budget, setBudgetState] = useState({});
  const [input, setInput]        = useState('');
  const [exps, setExps]          = useState([]);

  useEffect(() => {
    getBudget(user.user_id).then(r => { setBudgetState(r.data); setInput(r.data.limit_amount || ''); });
    getExpenses(user.user_id).then(r => setExps(r.data));
  }, [user]);

  const handleSave = async () => {
    const v = parseFloat(input);
    if (!v || v <= 0) { toast.error('Enter a valid budget amount'); return; }
    await setBudget({ user_id: user.user_id, limit_amount: v });
    setBudgetState({ limit_amount: v });
    toast.success('Budget updated!');
  };

  const now = new Date();
  const chartData = Array.from({ length:6 }, (_,i) => {
    const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const total = exps.filter(e=>e.date.slice(0,7)===ym).reduce((s,e)=>s+Number(e.amount),0);
    return { month: d.toLocaleString('default',{month:'short'}), spent: parseFloat(total.toFixed(2)), budget: Number(budget.limit_amount)||0 };
  });

  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const mTotal = exps.filter(e=>e.date.slice(0,7)===ym).reduce((s,e)=>s+Number(e.amount),0);
  const limit = Number(budget.limit_amount) || 0;
  const pct = limit > 0 ? Math.min(100,(mTotal/limit)*100) : 0;
  const cls = pct>=100?'#e03c3c':pct>=80?'#f07a3a':'#4caf85';

  const inp = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid #e8f0ec', borderRadius:8, fontSize:'.9rem', color:'#1a3028', background:'#f7faf8', outline:'none', fontFamily:'Nunito,sans-serif' };
  const lbl = { display:'block', fontSize:'.78rem', fontWeight:700, color:'#5a7a6c', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.04em' };

  return (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>Budget Management</h2>
        <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Set and track your monthly spending limit</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'.85rem' }}>Set Monthly Budget</div>
          <div style={{ marginBottom:'1rem' }}><label style={lbl}>Budget Limit (₹)</label><input style={inp} type="number" min="0" placeholder="e.g. 15000" value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={handleSave} style={{ padding:'.7rem 1.5rem', background:'#4caf85', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Update Budget</button>
        </div>
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'.85rem' }}>This Month's Status</div>
          {limit > 0 ? <>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', marginBottom:'.35rem' }}>
              <span>{fmtMoney(mTotal)} used</span>
              <span style={{ color:'#9eb8ac' }}>{pct.toFixed(1)}%</span>
            </div>
            <div style={{ background:'#e8f0ec', borderRadius:20, height:14, overflow:'hidden', marginBottom:'.5rem' }}>
              <div style={{ height:'100%', width:`${pct.toFixed(1)}%`, borderRadius:20, background:`linear-gradient(90deg,${cls},${cls}cc)`, transition:'width .5s' }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem', marginTop:'.75rem' }}>
              <div style={{ background:'#e8f5f0', padding:'.6rem .85rem', borderRadius:8 }}><div style={{ fontSize:'.72rem', color:'#9eb8ac' }}>Spent</div><strong>{fmtMoney(mTotal)}</strong></div>
              <div style={{ background: pct>=100?'#fde8e8':'#eaf4fb', padding:'.6rem .85rem', borderRadius:8 }}><div style={{ fontSize:'.72rem', color:'#9eb8ac' }}>Remaining</div><strong>{fmtMoney(Math.max(0,limit-mTotal))}</strong></div>
            </div>
            {pct>=100 && <div style={{ marginTop:'.75rem', padding:'.6rem .85rem', background:'#fde8e8', color:'#8b1a1a', borderRadius:8, fontSize:'.85rem', fontWeight:600, borderLeft:'4px solid #e05252' }}>Over budget this month!</div>}
            {pct>=80 && pct<100 && <div style={{ marginTop:'.75rem', padding:'.6rem .85rem', background:'#fef3e2', color:'#7a4a0a', borderRadius:8, fontSize:'.85rem', fontWeight:600, borderLeft:'4px solid #f0b429' }}>Approaching your limit</div>}
          </> : <p style={{ fontSize:'.85rem', color:'#9eb8ac' }}>Set a budget limit to see status.</p>}
        </div>
      </div>
      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
        <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Monthly Spending vs Budget</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" vertical={false}/>
            <XAxis dataKey="month" tick={{ fontSize:12, fill:'#9eb8ac' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:12, fill:'#9eb8ac' }} axisLine={false} tickLine={false} tickFormatter={v=>'₹'+v}/>
            <Tooltip formatter={v=>fmtMoney(v)} contentStyle={{ borderRadius:8, border:'1px solid #e8f0ec', fontSize:'.85rem' }}/>
            <Line type="monotone" dataKey="spent" stroke="#4caf85" strokeWidth={2.5} dot={{ fill:'#4caf85', r:4 }} name="Spent"/>
            <Line type="monotone" dataKey="budget" stroke="#f07a3a" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Budget"/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', marginTop:'.5rem', fontSize:'.8rem', color:'#9eb8ac' }}>
          <span><span style={{ display:'inline-block', width:10, height:10, borderRadius:2, background:'#4caf85', marginRight:4 }}/>Spent</span>
          <span><span style={{ display:'inline-block', width:10, height:4, background:'#f07a3a', marginRight:4, verticalAlign:'middle' }}/>Budget</span>
        </div>
      </div>
    </div>
  );
}
