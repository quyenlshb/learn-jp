// src/components/BadgeModal.js
import React from "react";

const BadgeModal = ({ badge, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">New Badge!</h2>
        <div className="text-4xl mb-2">🏅</div>
        <p className="text-lg font-semibold">{badge.name}</p>
        <p className="text-sm text-gray-500">Awarded: {new Date(badge.awardedAt?.toDate ? badge.awardedAt.toDate() : badge.awardedAt).toLocaleString()}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BadgeModal;
