// src/Toast.js
import React, { useEffect } from "react";
import "./toast.css";

const Toast = ({ id, message, onDone, duration = 1200 }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onDone && onDone(id);
    }, duration);
    return () => clearTimeout(t);
  }, [id, onDone, duration]);

  return (
    <div className="toast-root">
      <div className="toast-content">
        {message}
      </div>
    </div>
  );
};

export default Toast;
