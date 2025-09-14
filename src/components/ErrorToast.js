import React from 'react';

export default function ErrorToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="error-toast" role="alert" style={{position: 'fixed', right: 16, top: 16, zIndex: 9999}}>
      <div style={{background: '#fff7f7', border: '1px solid #ffcccc', padding: 12, borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.08)'}}>
        <strong style={{display: 'block', marginBottom: 6}}>Lỗi</strong>
        <div style={{marginBottom: 8}}>{message}</div>
        <button onClick={onClose} style={{padding: '6px 10px', borderRadius: 6}}>Đóng</button>
      </div>
    </div>
  );
}
