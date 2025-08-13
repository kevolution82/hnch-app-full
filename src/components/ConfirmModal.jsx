import React from 'react';
import './DangerModal.css';


// if alertOnly is true, only the ok button shows
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