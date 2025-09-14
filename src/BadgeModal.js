// src/BadgeModal.js
import React from "react";
import "./badge.css";

const BadgeModal = ({ badge, onClose }) => {
  if (!badge) return null;
  return (
    <div className="badge-modal-backdrop" onClick={onClose}>
      <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
        <div className="badge-icon">🏅</div>
        <h2>Thành tựu mới!</h2>
        <div className="badge-name">{badge.name}</div>
        <button className="btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default BadgeModal;
