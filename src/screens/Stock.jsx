import React, { useState } from 'react';
import { supabase } from '../supabase';

const Stock = ({ stock, fetchAll }) => {
  const [form, setForm] = useState({ itemName: '', quantity: '', rate: '' });
  const [editItem, setEditItem] = useState(null);

  const saveItem = async () => {
    if (!form.itemName || !form.quantity || !form.rate) {
      alert('Please fill all fields'); return;
    }
    const { data: existing } = await supabase
      .from('stock').select('*').eq('item_name', form.itemName).single();
    if (existing) {
      alert('Item already exists! Use Edit to update it.');
      return;
    }
    await supabase.from('stock').insert([{
      item_name: form.itemName,
      quantity: Number(form.quantity),
      rate: Number(form.rate),
      updated_at: new Date().toISOString(),
    }]);
    alert('Item added to stock!');
    setForm({ itemName: '', quantity: '', rate: '' });
    fetchAll();
  };

  const saveEdit = async () => {
    if (!editItem.quantity || !editItem.rate) {
      alert('Please fill quantity and rate'); return;
    }
    await supabase.from('stock').update({
      quantity: Number(editItem.quantity),
      rate: Number(editItem.rate),
      updated_at: new Date().toISOString(),
    }).eq('id', editItem.id);
    alert('Stock updated!');
    setEditItem(null);
    fetchAll();
  };

  const deleteItem = async (id, name) => {
    if (window.confirm('Delete ' + name + ' from stock?')) {
      await supabase.from('stock').delete().eq('id', id);
      fetchAll();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>Stock Management</div>

      {/* ADD NEW ITEM */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>Add New Item / Opening Stock</div>
        {[
          { label: 'Item Name *', key: 'itemName', placeholder: 'e.g. Samsung A32 LCD' },
          { label: 'Opening Quantity *', key: 'quantity', placeholder: '0', type: 'number' },
          { label: 'Rate (Rs.) *', key: 'rate', placeholder: '0', type: 'number' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{field.label}</div>
            <input type={field.type || 'text'} placeholder={field.placeholder} value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
          </div>
        ))}
        {form.quantity && form.rate && (
          <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#2e7d32' }}>
              Total Value: Rs.{Number(form.quantity) * Number(form.rate)}
            </div>
          </div>
        )}
        <button onClick={saveItem}
          style={{ width: '100%', background: '#1a73e8', color: 'white', border: 'none', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
          Add to Stock
        </button>
      </div>

      {/* STOCK SUMMARY */}
      <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: '#2e7d32', fontWeight: 'bold' }}>Total Items</div>
          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#2e7d32' }}>{stock.length}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <div style={{ fontSize: 13, color: '#2e7d32', fontWeight: 'bold' }}>Total Stock Value</div>
          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#2e7d32' }}>
            Rs.{stock.reduce((s, item) => s + (Number(item.quantity) * Number(item.rate)), 0)}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <div style={{ fontSize: 13, color: '#c62828', fontWeight: 'bold' }}>Out of Stock</div>
          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#c62828' }}>
            {stock.filter(i => i.quantity <= 0).length} items
          </div>
        </div>
      </div>

      {/* STOCK LIST */}
      <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>All Stock Items</div>
      {stock.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>No stock items yet.</div>
      )}
      {stock.map((item, i) => (
        <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid ' + (item.quantity <= 0 ? '#c62828' : item.quantity <= 2 ? '#f57c00' : '#2e7d32') }}>
          {editItem && editItem.id === item.id ? (
            /* EDIT MODE */
            <div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: '#1a73e8', marginBottom: 10 }}>{item.item_name}</div>
              {[
                { label: 'Quantity', key: 'quantity', type: 'number' },
                { label: 'Rate (Rs.)', key: 'rate', type: 'number' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{field.label}</div>
                  <input type={field.type} value={editItem[field.key]}
                    onChange={e => setEditItem({ ...editItem, [field.key]: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={saveEdit}
                  style={{ flex: 1, background: '#2e7d32', color: 'white', border: 'none', borderRadius: 8, padding: 8, fontSize: 13, cursor: 'pointer' }}>
                  Save
                </button>
                <button onClick={() => setEditItem(null)}
                  style={{ flex: 1, background: '#555', color: 'white', border: 'none', borderRadius: 8, padding: 8, fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* VIEW MODE */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>{item.item_name}</div>
                <div style={{
                  background: item.quantity <= 0 ? '#fce4ec' : item.quantity <= 2 ? '#fff3e0' : '#e8f5e9',
                  color: item.quantity <= 0 ? '#c62828' : item.quantity <= 2 ? '#f57c00' : '#2e7d32',
                  padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 'bold'
                }}>
                  {item.quantity <= 0 ? 'Out of Stock' : item.quantity <= 2 ? 'Low Stock' : 'In Stock'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ fontSize: 13, color: '#666' }}>Qty: <span style={{ fontWeight: 'bold', color: '#333' }}>{item.quantity}</span></div>
                <div style={{ fontSize: 13, color: '#666' }}>Rate: <span style={{ fontWeight: 'bold', color: '#333' }}>Rs.{item.rate}</span></div>
                <div style={{ fontSize: 13, color: '#666' }}>Value: <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>Rs.{Number(item.quantity) * Number(item.rate)}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setEditItem({ ...item })}
                  style={{ flex: 1, background: '#555', color: 'white', border: 'none', borderRadius: 8, padding: 7, fontSize: 12, cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => deleteItem(item.id, item.item_name)}
                  style={{ flex: 1, background: '#c62828', color: 'white', border: 'none', borderRadius: 8, padding: 7, fontSize: 12, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stock;