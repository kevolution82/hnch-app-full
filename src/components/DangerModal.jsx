import React from 'react';
import './DangerModal.css';

// Reusable modal for confirmations or alerts
function ConfirmModal({ message, onConfirm, onCancel, confirmText = 'Yes', cancelText = 'Cancel', alertOnly = false }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            {alertOnly ? 'OK' : confirmText}
          </button>
          {!alertOnly && (
            <button className="cancel-btn" onClick={onCancel}>
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
