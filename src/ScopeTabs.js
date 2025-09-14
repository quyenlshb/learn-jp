// src/ScopeTabs.js
import React from 'react';

const ScopeTabs = ({ value, onChange }) => {
  return (
    <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
      <button onClick={() => onChange('global')} className={`px-3 py-1 rounded-lg ${value==='global' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        Toàn hệ thống
      </button>
      <button onClick={() => onChange('course')} className={`px-3 py-1 rounded-lg ${value==='course' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        Theo khóa học
      </button>
      <button onClick={() => onChange('group')} className={`px-3 py-1 rounded-lg ${value==='group' ? 'bg-white shadow text-black' : 'text-gray-600'}`}>
        Nhóm
      </button>
    </div>
  );
};

export default ScopeTabs;
