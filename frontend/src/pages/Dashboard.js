import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getExpenses, getCategories, getBudget } from '../api';

const fmtMoney = v => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const currentYM = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`; };

export default function Dashboard({ user }) {
  const [exps, setExps]   = useState([]);
  const [cats, setCats]   = useState([]);
  const [budget, setBudget] = useState({});

  useEffect(() => {
    getExpenses(user.user_id).then(r => setExps(r.data));
    getCategories(user.user_id).then(r => setCats(r.data));
    getBudget(user.user_id).then(r => setBudget(r.data));
  }, [user]);

  const ym = currentYM();
  const mExps = exps.filter(e => e.date.slice(0,7) === ym);
  const mTotal = mExps.reduce((s,e) => s + Number(e.amount), 0);
  const limit = Number(budget.limit_amount) || 0;
  const pct = limit > 0 ? Math.min(100, (mTotal / limit) * 100) : 0;
  const remaining = Math.max(0, limit - mTotal);

  const catData = cats.map(c => ({
    name: c.name.length > 10 ? c.name.slice(0,10)+'…' : c.name,
    spent: mExps.filter(e => e.cat_id === c.cat_id).reduce((s,e) => s+Number(e.amount), 0)
  })).filter(d => d.spent > 0);

  const recent = exps.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);

  const statCard = (label, value, color) => (
    <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.1rem 1.25rem', flex:1, minWidth:130 }}>
      <div style={{ fontSize:'.75rem', fontWeight:700, color:'#9eb8ac', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:'.35rem' }}>{label}</div>
      <div style={{ fontSize:'1.5rem', fontWeight:800, color }}>{value}</div>
    </div>
  );

  const h = new Date().getHours();
  const greet = h<12?'Good morning ☀️':h<17?'Good afternoon 🌤️':'Good evening 🌙';

  return (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>{greet}, {user.name.split(' ')[0]}</h2>
        <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Here's your financial overview for this month</p>
      </div>

      <div style={{ display:'flex', gap:'.85rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
        {statCard('This Month', fmtMoney(mTotal), '#1a3028')}
        {statCard('Monthly Budget', limit > 0 ? fmtMoney(limit) : 'Not set', '#3a8cc4')}
        {statCard('Remaining', limit > 0 ? fmtMoney(remaining) : '—', '#4caf85')}
        {statCard('Transactions', mExps.length, '#7c5cbf')}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
        {/* Budget */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'.85rem' }}>Budget Usage</div>
          {limit > 0 ? <>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', marginBottom:'.35rem' }}>
              <span style={{ color:'#5a7a6c' }}>{fmtMoney(mTotal)} spent</span>
              <span style={{ color:'#9eb8ac' }}>{pct.toFixed(1)}%</span>
            </div>
            <div style={{ background:'#e8f0ec', borderRadius:20, height:12, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct.toFixed(1)}%`, borderRadius:20, background: pct>=100?'linear-gradient(90deg,#f07a3a,#e03c3c)':pct>=80?'linear-gradient(90deg,#f0b429,#f07a3a)':'linear-gradient(90deg,#4caf85,#3a8cc4)', transition:'width .5s' }}/>
            </div>
            <div style={{ fontSize:'.8rem', color: pct>=100?'#e03c3c':pct>=80?'#f07a3a':'#4caf85', marginTop:'.35rem', fontWeight:600 }}>
              {pct>=100?'Over budget!':pct>=80?'Approaching limit':'On track'}
            </div>
          </> : <p style={{ fontSize:'.85rem', color:'#9eb8ac' }}>No budget set yet.</p>}
        </div>

        {/* Recent */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'.85rem' }}>Recent Expenses</div>
          {recent.length ? recent.map(e => {
            const cat = cats.find(c => c.cat_id === e.cat_id);
            return (
              <div key={e.expense_id} style={{ display:'flex', justifyContent:'space-between', padding:'.45rem 0', borderBottom:'1px solid #e8f0ec' }}>
                <div>
                  <div style={{ fontSize:'.875rem', fontWeight:600 }}>{e.description || 'Expense'}</div>
                  <div style={{ fontSize:'.75rem', color:'#9eb8ac' }}>{cat?.name || '—'}</div>
                </div>
                <div style={{ fontWeight:700, color:'#2e7d5e' }}>{fmtMoney(e.amount)}</div>
              </div>
            );
          }) : <p style={{ fontSize:'.85rem', color:'#9eb8ac' }}>No expenses yet.</p>}
        </div>
      </div>

      {/* Chart */}
      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
        <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Spending by Category (This Month)</div>
        {catData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" vertical={false}/>
              <XAxis dataKey="name" tick={{ fontSize:12, fill:'#9eb8ac' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12, fill:'#9eb8ac' }} axisLine={false} tickLine={false} tickFormatter={v=>'₹'+v}/>
              <Tooltip formatter={v => fmtMoney(v)} contentStyle={{ borderRadius:8, border:'1px solid #e8f0ec', fontSize:'.85rem' }}/>
              <Bar dataKey="spent" fill="#4caf85" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        ) : <p style={{ fontSize:'.85rem', color:'#9eb8ac' }}>Add expenses to see chart.</p>}
      </div>
    </div>
  );
}
