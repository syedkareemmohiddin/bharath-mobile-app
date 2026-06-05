import React, { useState } from 'react';

const PaymentModal = ({ modal, onConfirm, onClose }) => {
  const [amount, setAmount] = useState(modal.defaultAmount || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!modal.show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>{modal.title}</div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{modal.subtitle}</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>Amount Received (Rs.) *</div>
          <input type='number' placeholder='0' value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }}
            autoFocus />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>Payment Date</div>
          <input type='date' value={date}
            onChange={e => setDate(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, boxSizing: 'border-box' }} />
        </div>
        {amount && (
          <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#2e7d32' }}>
              Collecting: Rs.{amount} on {date}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, background: '#f5f5f5', color: '#555', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(Number(amount) || 0, date)}
            style={{ flex: 2, background: '#2e7d32', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;