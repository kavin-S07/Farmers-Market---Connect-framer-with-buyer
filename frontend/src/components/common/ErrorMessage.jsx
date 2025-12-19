
import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="flex-between">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
