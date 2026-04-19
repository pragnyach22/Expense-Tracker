import React, { useEffect, useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory, getExpenses } from '../api';
import toast from 'react-hot-toast';

const COLORS = ['#e8f5f0:#2e7d5e','#eaf4fb:#1a5a8a','#fef3ee:#b05a1a','#f0edf8:#5c3a9e','#fefbe8:#7a5c10','#fde8e8:#8b1a1a'];

export default function Categories({ user }) {
  const [cats, setCats]       = useState([]);
  const [expCounts, setExpCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat]    = useState(null);
  const [name, setName]          = useState('');

  const load = () => {
    getCategories(user.user_id).then(r => setCats(r.data));
    getExpenses(user.user_id).then(r => {
      const counts = {};
      r.data.forEach(e => { counts[e.cat_id] = (counts[e.cat_id]||0)+1; });
      setExpCounts(counts);
    });
  };
  useEffect(() => { load(); }, [user]);

  const openModal = (cat=null) => { setEditCat(cat); setName(cat?cat.name:''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditCat(null); setName(''); };

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Enter a category name'); return; }
    try {
      if (editCat) { await updateCategory(editCat.cat_id, { user_id:user.user_id, name }); toast.success('Category updated'); }
      else         { await addCategory({ user_id:user.user_id, name }); toast.success('Category added'); }
      closeModal(); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try { await deleteCategory(cat.cat_id, user.user_id); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.response?.data?.error || 'Cannot delete'); }
  };

  const inp = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid #e8f0ec', borderRadius:8, fontSize:'.9rem', color:'#1a3028', background:'#f7faf8', outline:'none', fontFamily:'Nunito,sans-serif' };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'.75rem' }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a3028' }}>Categories</h2>
          <p style={{ fontSize:'.85rem', color:'#9eb8ac', marginTop:'.2rem' }}>Organise your spending</p>
        </div>
        <button onClick={()=>openModal()} style={{ padding:'.6rem 1.25rem', background:'#4caf85', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>+ New Category</button>
      </div>

      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 12px rgba(0,60,40,.07)', padding:'1.25rem' }}>
        {cats.length === 0 ? (
          <div style={{ textAlign:'center', padding:'2rem', color:'#9eb8ac' }}>No categories yet. Add one!</div>
        ) : cats.map((cat, i) => {
          const [bg, col] = COLORS[i%COLORS.length].split(':');
          return (
            <div key={cat.cat_id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.7rem .85rem', background:'#f7faf8', borderRadius:8, marginBottom:'.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:col, display:'inline-block' }}/>
                <span style={{ fontWeight:700, color:'#1a3028' }}>{cat.name}</span>
                <span style={{ fontSize:'.75rem', color:'#9eb8ac' }}>{expCounts[cat.cat_id]||0} expense{expCounts[cat.cat_id]!==1?'s':''}</span>
              </div>
              <div style={{ display:'flex', gap:'.35rem' }}>
                <button onClick={()=>openModal(cat)} style={{ width:30, height:30, borderRadius:6, border:'none', background:'#eaf4fb', color:'#3a8cc4', cursor:'pointer', fontWeight:700 }}>✎</button>
                <button onClick={()=>handleDelete(cat)} style={{ width:30, height:30, borderRadius:6, border:'none', background:'#fde8e8', color:'#c0392b', cursor:'pointer', fontWeight:700 }}>✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,40,30,.35)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={closeModal}>
          <div style={{ background:'#fff', borderRadius:20, padding:'1.75rem', width:'100%', maxWidth:400, boxShadow:'0 4px 20px rgba(0,60,40,.12)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <h3 style={{ fontWeight:800, fontSize:'1.1rem', color:'#1a3028' }}>{editCat?'Edit Category':'New Category'}</h3>
              <button onClick={closeModal} style={{ width:32, height:32, borderRadius:'50%', background:'#e8f0ec', border:'none', cursor:'pointer', fontSize:'1rem', color:'#5a7a6c' }}>✕</button>
            </div>
            <div style={{ marginBottom:'1.25rem' }}>
              <label style={{ display:'block', fontSize:'.78rem', fontWeight:700, color:'#5a7a6c', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.04em' }}>Category Name</label>
              <input style={inp} placeholder="e.g. Groceries, Transport..." value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSave()} autoFocus/>
            </div>
            <div style={{ display:'flex', gap:'.75rem' }}>
              <button onClick={handleSave} style={{ padding:'.7rem 1.5rem', background:'#4caf85', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Save</button>
              <button onClick={closeModal} style={{ padding:'.7rem 1.25rem', background:'transparent', color:'#2e7d5e', border:'1.5px solid #4caf85', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
