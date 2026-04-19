import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getExpenses, getCategories, getBudget, getReports } from '../api';

const fmtMoney = v => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 });
const PIE_COLORS = ['#4caf85','#3a8cc4','#f07a3a','#7c5cbf','#c49a1a','#e05252','#2596be'];

export default function Reports({ user }) {
  const [exps, setExps]     = useState([]);
  const [cats, setCats]     = useState([]);
  const [budget, setBudget] = useState({});
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getExpenses(user.user_id).then(r => setExps(r.data));
    getCategories(user.user_id).then(r => setCats(r.data));
    getBudget(user.user_id).then(r => setBudget(r.data));
    getReports(user.user_id).then(r => setReports(r.data));
  }, [user]);

  const now = new Date();
  const ym  = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const mExps   = exps.filter(e => e.date.slice(0,7)===ym);
  const mTotal  = mExps.reduce((s,e) => s+Number(e.amount), 0);
  const avgTxn  = mExps.length ? mTotal/mExps.length : 0;
  const maxExp  = mExps.length ? Math.max(...mExps.map(e=>Number(e.amount))) : 0;

  // Trend – last 6 months
  const trendData = Array.from({length:6},(_,i) => {
    const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const total = exps.filter(e=>e.date.slice(0,7)===key).reduce((s,e)=>s+Number(e.amount),0);
    return { month: d.toLocaleString('default',{month:'short'}), amount: parseFloat(total.toFixed(2)) };
  });

  // Pie – current month category breakdown
  const pieData = cats.map(c => ({
    name: c.name,
    value: parseFloat(mExps.filter(e=>e.cat_id===c.cat_id).reduce((s,e)=>s+Number(e.amount),0).toFixed(2))
  })).filter(d => d.value > 0);

  const limit = Number(budget.limit_amount)||0;

  const statCard = (label, value, bg) => (
    <div style={{ background:bg||'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.1rem 1.25rem' }}>
      <div style={{ fontSize:'.75rem', fontWeight:700, color:'#9eb8ac', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:'.35rem' }}>{label}</div>
      <div style={{ fontSize:'1.4rem', fontWeight:800, color:'#1a3028' }}>{value}</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>Reports & Analytics</h2>
        <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Understand your spending patterns</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'.85rem', marginBottom:'1.25rem' }}>
        {statCard('This Month', fmtMoney(mTotal))}
        {statCard('Avg per Txn', mExps.length ? fmtMoney(avgTxn) : '—')}
        {statCard('Largest', mExps.length ? fmtMoney(maxExp) : '—')}
        {statCard('Transactions', mExps.length)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Monthly Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'#9eb8ac' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12, fill:'#9eb8ac' }} axisLine={false} tickLine={false} tickFormatter={v=>'₹'+v}/>
              <Tooltip formatter={v=>fmtMoney(v)} contentStyle={{ borderRadius:8, border:'1px solid #e8f0ec', fontSize:'.85rem' }}/>
              <Line type="monotone" dataKey="amount" stroke="#4caf85" strokeWidth={2.5} dot={{ fill:'#4caf85', r:4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
          <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Category Breakdown (This Month)</div>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={v=>fmtMoney(v)} contentStyle={{ borderRadius:8, border:'1px solid #e8f0ec', fontSize:'.85rem' }}/>
                <Legend iconSize={10} iconType="square" wrapperStyle={{ fontSize:'.78rem' }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ fontSize:'.85rem', color:'#9eb8ac', padding:'2rem 0', textAlign:'center' }}>No data this month</p>}
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
        <div style={{ fontWeight:700, color:'#1a3028', marginBottom:'1rem' }}>Monthly Reports</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.875rem' }}>
            <thead>
              <tr style={{ borderBottom:'1.5px solid #e8f0ec' }}>
                {['Month','Total Expenses','Budget','Status'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'.65rem 1rem', fontSize:'.75rem', fontWeight:700, color:'#9eb8ac', textTransform:'uppercase', letterSpacing:'.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.length ? reports.map(r => {
                const pct = limit > 0 ? (r.total_expense/limit)*100 : 0;
                const [bg,col] = pct>=100 ? ['#fde8e8','#8b1a1a'] : pct>=80 ? ['#fefbe8','#7a5c10'] : ['#e8f5f0','#2e7d5e'];
                const label = pct>=100?'Over Budget':pct>=80?'Near Limit':'On Track';
                const mLabel = `${new Date(r.year,r.month-1).toLocaleString('default',{month:'long'})} ${r.year}`;
                return (
                  <tr key={r.report_id} style={{ borderBottom:'1px solid #e8f0ec' }}>
                    <td style={{ padding:'.7rem 1rem' }}>{mLabel}</td>
                    <td style={{ padding:'.7rem 1rem', fontWeight:700 }}>{fmtMoney(r.total_expense)}</td>
                    <td style={{ padding:'.7rem 1rem', color:'#9eb8ac' }}>{limit>0?fmtMoney(limit):'—'}</td>
                    <td style={{ padding:'.7rem 1rem' }}><span style={{ background:bg, color:col, borderRadius:20, padding:'.22rem .75rem', fontSize:'.75rem', fontWeight:700 }}>{label}</span></td>
                  </tr>
                );
              }) : <tr><td colSpan={4} style={{ padding:'2rem', textAlign:'center', color:'#9eb8ac' }}>No report data yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
