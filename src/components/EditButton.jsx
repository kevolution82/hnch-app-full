import React from 'react';
import './EditButton.css';

function EditButton({ onClick, disabled = false }) {
  return (
    <button
      className="edit-btn"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Edit
    </button>
  );
}

export default EditButton;