// src/TimeTabs.js
import React from 'react';

const TimeTabs = ({ value, onChange }) => {
  return (
    <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
      <button onClick={() => onChange('daily')} className={`px-3 py-1 rounded-lg ${value==='daily' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        Ngày
      </button>
      <button onClick={() => onChange('weekly')} className={`px-3 py-1 rounded-lg ${value==='weekly' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        Tuần
      </button>
      <button onClick={() => onChange('monthly')} className={`px-3 py-1 rounded-lg ${value==='monthly' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        Tháng
      </button>
      <button onClick={() => onChange('total')} className={`px-3 py-1 rounded-lg ${value==='total' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        All-time
      </button>
    </div>
  );
};

export default TimeTabs;
