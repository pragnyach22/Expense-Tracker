import React, { useEffect, useState } from 'react';
import { addExpense, updateExpense, getCategories } from '../api';
import toast from 'react-hot-toast';

export default function AddExpense({ user, editData, onDone }) {
  const [amount, setAmount]   = useState('');
  const [catId, setCatId]     = useState('');
  const [date, setDate]       = useState(new Date().toISOString().slice(0,10));
  const [desc, setDesc]       = useState('');
  const [cats, setCats]       = useState([]);

  useEffect(() => {
    getCategories(user.user_id).then(r => {
      setCats(r.data);
      if (r.data.length) setCatId(String(r.data[0].cat_id));
    });
  }, [user]);

  useEffect(() => {
    if (editData) {
      setAmount(editData.amount);
      setCatId(String(editData.cat_id));
      setDate(editData.date);
      setDesc(editData.description || '');
    }
  }, [editData]);

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    if (!catId) { toast.error('Select a category'); return; }
    if (!date) { toast.error('Select a date'); return; }
    const payload = { user_id: user.user_id, cat_id: Number(catId), amount: Number(amount), date, description: desc };
    try {
      if (editData) {
        await updateExpense({ ...payload, expense_id: editData.expense_id });
        toast.success('Expense updated');
      } else {
        await addExpense(payload);
        toast.success('Expense added');
      }
      onDone();
    } catch { toast.error('Failed to save'); }
  };

  const inp = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid #e8f0ec', borderRadius:8, fontSize:'.9rem', color:'#1a3028', background:'#f7faf8', outline:'none', fontFamily:'Nunito,sans-serif' };
  const lbl = { display:'block', fontSize:'.78rem', fontWeight:700, color:'#5a7a6c', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.04em' };

  return (
    <div>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>{editData ? 'Edit Expense' : 'Add Expense'}</h2>
        <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Record a transaction</p>
      </div>
      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.5rem', maxWidth:480 }}>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Amount (₹)</label>
          <input style={inp} type="number" placeholder="0.00" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/>
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Category</label>
          <select style={inp} value={catId} onChange={e=>setCatId(e.target.value)}>
            {cats.map(c => <option key={c.cat_id} value={c.cat_id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Date</label>
          <input style={inp} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        </div>
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={lbl}>Description</label>
          <input style={inp} placeholder="What was this for?" value={desc} onChange={e=>setDesc(e.target.value)}/>
        </div>
        <div style={{ display:'flex', gap:'.75rem' }}>
          <button onClick={handleSave} style={{ padding:'.7rem 1.5rem', background:'#4caf85', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
            {editData ? 'Update Expense' : 'Save Expense'}
          </button>
          <button onClick={onDone} style={{ padding:'.7rem 1.25rem', background:'transparent', color:'#2e7d5e', border:'1.5px solid #4caf85', borderRadius:8, fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
