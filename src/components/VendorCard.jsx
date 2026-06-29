import React from 'react';
import { supabase } from '../supabase';
import { fmtDateTime } from '../utils/format';

const VendorCard = ({ v, purchases, vendorPayments, vendors, fetchAll }) => {
  const vPurchases = purchases.filter(p => p.vendor_name === v.name);
  const vPayments = vendorPayments.filter(vp => vp.vendor_name === v.name);

  // Calculate balance from actual transactions (not from DB)
  const calculatedBalance = 
    vPurchases.filter(p => p.payment_type === 'Credit').reduce((s, p) => s + Number(p.total || 0), 0) -
    vPayments.reduce((s, vp) => s + Number(vp.amount || 0), 0);
  const history = [
    ...vPurchases.map(p => ({
      date: p.created_at, title: p.item_name,
      detail: 'Qty: ' + p.quantity + ' x Rs.' + p.rate + ' | ' + p.payment_type,
      amount: p.total, color: '#c62828', sign: '+', type: 'Purchase',
    })),
    ...vPayments.map(vp => ({
      date: vp.created_at, title: 'Payment made',
      detail: 'Paid to ' + v.name,
      amount: vp.amount, color: '#2e7d32', sign: '-', type: 'Payment',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 15 }}>{v.name}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>📞 {v.phone}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', fontSize: 16, color: calculatedBalance > 0 ? '#c62828' : calculatedBalance < 0 ? '#2e7d32' : '#888' }}>
            {calculatedBalance < 0 ? '-Rs.' + Math.abs(calculatedBalance) : 'Rs.' + calculatedBalance}
          </div>
          <div style={{ fontSize: 11, color: calculatedBalance > 0 ? '#c62828' : calculatedBalance < 0 ? '#2e7d32' : '#888' }}>
            {calculatedBalance > 0 ? 'Payable' : calculatedBalance < 0 ? 'Receivable' : 'Clear'}
          </div>
        </div>
      </div>

      {calculatedBalance !== 0 && (
        <button onClick={async () => {
          const paid = prompt('Pay to ' + v.name + '\nCurrent balance: Rs.' + calculatedBalance + '\nEnter amount paying:');
          if (paid === null) return;
          const amount = Number(paid) || 0;
          await supabase.from('vendor_payments').insert([{ vendor_id: v.id, vendor_name: v.name, amount: amount }]);
          fetchAll();
        }}
          style={{ width: '100%', marginTop: 10, background: '#1a73e8', color: 'white', border: 'none', borderRadius: 8, padding: 8, fontSize: 13, cursor: 'pointer' }}>
          Pay Balance
        </button>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => {
          const newName = prompt('Edit vendor name:', v.name);
          if (!newName) return;
          const newPhone = prompt('Edit phone:', v.phone);
          supabase.from('vendors').update({ name: newName, phone: newPhone || v.phone }).eq('id', v.id).then(() => fetchAll());
        }}
          style={{ flex: 1, background: '#555', color: 'white', border: 'none', borderRadius: 8, padding: 8, fontSize: 13, cursor: 'pointer' }}>
          Edit
        </button>
        <button onClick={async () => {
          if (window.confirm('Delete ' + v.name + '? This cannot be undone!')) {
            await supabase.from('vendors').delete().eq('id', v.id);
            fetchAll();
          }
        }}
          style={{ flex: 1, background: '#c62828', color: 'white', border: 'none', borderRadius: 8, padding: 8, fontSize: 13, cursor: 'pointer' }}>
          Delete
        </button>
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>Transaction History</div>
          {history.map((tx, i) => (
            <div key={i} style={{ borderLeft: '3px solid ' + tx.color, paddingLeft: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>{tx.title}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{tx.detail}</div>
                  <div style={{ fontSize: 10, color: '#999' }}>{fmtDateTime(tx.date)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: tx.color }}>{tx.sign}Rs.{tx.amount}</div>
                  <div style={{ fontSize: 10, background: tx.color, color: 'white', padding: '1px 6px', borderRadius: 8 }}>{tx.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {history.length === 0 && (
        <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>No transactions yet</div>
      )}
    </div>
  );
};

export default VendorCard;