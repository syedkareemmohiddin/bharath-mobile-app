import React, { useState } from 'react';
import { supabase } from '../supabase';

const Staff = ({ staff, fetchAll }) => {
  const [name, setName] = useState('');

  const addStaff = async () => {
    if (!name.trim()) { alert('Enter staff name'); return; }
    const { error } = await supabase.from('staff').insert([{ name: name.trim() }]);
    if (error) { alert('Error: ' + error.message); return; }
    setName('');
    fetchAll();
  };

  const deleteStaff = async (id, staffName) => {
    if (window.confirm('Delete ' + staffName + '?')) {
      await supabase.from('staff').delete().eq('id', id);
      fetchAll();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>Staff</div>

      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>Add New Staff</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type='text' placeholder='e.g. Karim' value={name}
            onChange={e => setName(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, boxSizing: 'border-box' }} />
          <button onClick={addStaff}
            style={{ background: '#1a73e8', color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
            + Add
          </button>
        </div>
      </div>

      {(staff || []).length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', padding: 30, background: 'white', borderRadius: 12 }}>
          No staff added yet
        </div>
      )}
      {(staff || []).map((s, i) => (
        <div key={i} style={{ background: 'white', borderRadius: 10, padding: 14, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>👤 {s.name}</div>
          <button onClick={() => deleteStaff(s.id, s.name)}
            style={{ background: '#c62828', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Staff;
